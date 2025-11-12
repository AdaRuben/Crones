const SupportChatService = require('../services/supportChat.service');

class SupportChatController {
  static async getCustomerChat(req, res) {
    try {
      const customerId = Number(req.params.customerId);
      if (!customerId) {
        return res.status(400).json({ message: 'customerId is required' });
      }

      const chat = await SupportChatService.getChatForCustomer(customerId);
      return res.status(200).json(chat);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  }

  static async getChatMessages(req, res) {
    try {
      const chatId = Number(req.params.chatId);
      const limit = Number(req.query.limit ?? 200);
      const offset = Number(req.query.offset ?? 0);

      if (!chatId) {
        return res.status(400).json({ message: 'chatId is required' });
      }

      const messages = await SupportChatService.listMessages(chatId, limit, offset);
      return res.status(200).json(messages);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  }

  static async getAdminChats(req, res) {
    try {
      const adminId = Number(req.params.adminId);
      if (!adminId) {
        return res.status(400).json({ message: 'adminId is required' });
      }

      const tokenAdmin = res.locals.admin;
      if (!tokenAdmin || tokenAdmin.id !== adminId) {
        return res.status(403).json({ message: 'Access denied' });
      }

      const [assigned, pending] = await Promise.all([
        SupportChatService.listChatsForAdmin(adminId),
        SupportChatService.listUnassignedChats(),
      ]);

      return res.status(200).json({
        assigned,
        pending,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  }
}

module.exports = SupportChatController;
