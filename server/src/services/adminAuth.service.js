const { Admin } = require('../../db/models');
const bcrypt = require('bcrypt');

class AdminAuthService {
  static async signup({ name, email, password }) {
    if (!name || !email || !password) {
      throw new Error('All fields should be filled in');
    }
    const hashpass = await bcrypt.hash(password, 10);

    const [admin, created] = await Admin.findOrCreate({
      where: { email },
      defaults: {
        name,
        hashpass,
      },
    });

    if (!created) {
      throw new Error('Email is already taken');
    }

    const plainAdmin = admin.get();

    delete plainAdmin.hashpass;

    return plainAdmin;
  }

  static async signin({ email, password }) {
    if (!email || !password) {
      throw new Error('All fields should be filled in');
    }

    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      throw new Error('Wrong email or password');
    }

    const passwordMatches = await bcrypt.compare(password, admin.hashpass);
    if (!passwordMatches) {
      throw new Error('Wrong email or password');
    }

    const plainAdmin = admin.get();
    delete plainAdmin.hashpass;
    return plainAdmin;
  }
}

module.exports = AdminAuthService;
