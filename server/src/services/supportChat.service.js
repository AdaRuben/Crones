const { SupportChat, SupportMessage, Customer, Admin } = require('../../db/models');

class SupportChatService {
  static async findOrCreateChat({ chatId, customerId, adminId }) {
    let chat = null;

    if (chatId) {
      chat = await SupportChat.findByPk(chatId);
    }

    if (!chat && customerId) {
      chat = await SupportChat.findOne({ where: { customerId } });
    }

    if (!chat) {
      if (!customerId) {
        throw new Error('customerId is required to create support chat');
      }

      const customer = await Customer.findByPk(customerId);
      if (!customer) {
        throw new Error('Customer not found');
      }

      chat = await SupportChat.create({
        customerId: customer.id,
        adminId: adminId ?? null,
      });
    } else if (!chat.adminId && adminId) {
      chat = await chat.update({ adminId });
    }

    return chat;
  }

  static async listChatsForAdmin(adminId) {
    return SupportChat.findAll({
      where: {
        adminId,
      },
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'name', 'phoneNumber'],
        },
        {
          model: Admin,
          as: 'admin',
          attributes: ['id', 'name', 'email'],
        },
      ],
      order: [['updatedAt', 'DESC']],
    });
  }

  static async listUnassignedChats() {
    return SupportChat.findAll({
      where: { adminId: null },
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'name', 'phoneNumber'],
        },
      ],
      order: [['updatedAt', 'DESC']],
    });
  }

  static async getChatForCustomer(customerId) {
    return SupportChat.findOne({
      where: { customerId },
      include: [
        {
          model: Admin,
          as: 'admin',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });
  }

  static async listMessages(chatId, limit = 100, offset = 0) {
    const records = await SupportMessage.findAll({
      where: { chatId },
      order: [['createdAt', 'ASC']],
      limit,
      offset,
    });

    return records.map((row) => {
      const data = row.get();
      return {
        id: data.id,
        chatId: data.chatId,
        body: data.body,
        attachments: data.attachments,
        senderId: data.senderId,
        senderRole: data.senderType ?? 'customer',
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };
    });
  }

  static async appendMessage({ chatId, senderType, senderId, body, attachments }) {
    const message = await SupportMessage.create({
      chatId,
      senderType,
      senderId,
      body,
      attachments: attachments ?? null,
    });

    await SupportChat.update(
      { updatedAt: new Date() },
      {
        where: { id: chatId },
      },
    );

    return message;
  }
}

module.exports = SupportChatService;
