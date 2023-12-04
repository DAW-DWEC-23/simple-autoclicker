'use strict';

// Helper class for the clicker game
export default class ClickerHelper {
  // Format a number to a human readable format
  static formatAmount(amount) {
    if (amount < 1e3) return amount.toFixed(2);
    if (amount < 1e6) return (amount / 1e3).toFixed(2) + "K";
    if (amount < 1e9) return (amount / 1e6).toFixed(2) + "M";
    if (amount < 1e12) return (amount / 1e9).toFixed(2) + "B";
    if (amount < 1e15) return (amount / 1e12).toFixed(2) + "T";
    if (amount < 1e18) return (amount / 1e15).toFixed(2) + "Q";
    if (amount < 1e21) return (amount / 1e18).toFixed(2) + "Qi";
    if (amount < 1e24) return (amount / 1e21).toFixed(2) + "Sx";
    if (amount < 1e27) return (amount / 1e24).toFixed(2) + "Sp";
    if (amount < 1e30) return (amount / 1e27).toFixed(2) + "Oc";
    if (amount < 1e33) return (amount / 1e30).toFixed(2) + "No";
  }

  // Custom event messages
  static MsgBankSubtract = "clicker:bank-subtract";
  static MsgBankAdd = "clicker:bank-add";
  static MsgBankUpdate = "clicker:bank-savings";
  static MsgGeneratorUpgrade = "clicker:generator-upgrade";

}
