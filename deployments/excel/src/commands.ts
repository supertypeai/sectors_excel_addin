// ============================================================
// commands.ts — Ribbon command handlers.
// Registered via Office.actions.associate().
// ============================================================

/* global Office */

Office.onReady(() => {
  // If needed, Office.js is ready to be called.
});

/**
 * Shows a notification when the add-in command is executed.
 */
function action(event: Office.AddinCommands.Event): void {
  const message: Office.MailboxEnums.ItemNotificationMessageType =
    Office.MailboxEnums.ItemNotificationMessageType.InformationalMessage;

  const details: Office.NotificationMessageDetails = {
    type: message,
    message: "Performed action.",
    icon: "Icon.80x80",
    persistent: true,
  };

  Office.context.mailbox.item?.notificationMessages.replaceAsync("action", details);

  event.completed();
}

// Register the function with Office.
Office.actions.associate("action", action);
