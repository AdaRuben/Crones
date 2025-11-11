const { Customer } = require('../../db/models');
const bcrypt = require('bcrypt');

class AuthService {
  static async signup(userData) {
    const { name, phoneNumber, password } = userData;

    const user = await Customer.create({
      name,
      phoneNumber,
      hashpass: await bcrypt.hash(password, 10),
    });

    const plainUser = user.get();

    delete plainUser.hashpass;

    return plainUser;
  }

  static async signin(userData) {
    const { phoneNumber, password } = userData;
    const user = await Customer.findOne({ where: { phoneNumber } });
    if (!user) {
      throw new Error('Invalid phoneNumber or password');
    }
    const passwordMatch = await bcrypt.compare(password, user.hashpass);
    if (!passwordMatch) {
      throw new Error('Invalid phoneNumber or password');
    }
    const plainUser = user.get();
    delete plainUser.hashpass;
    return plainUser;
  }
}

module.exports = AuthService;
