var divEscapedContentElement = function(message) {
  return $("<div></div>").text(message);
}

var divSystemContentElement = function(message) {
  return $("<div></div>").html("<i>" + message + "</i>");
}

var processUserInput(chatApp, socket) {
  var message = $("#send-message").val();
  var systemMessage;

  if (message.charAt(0) === "/") {
    systemMessage = chatApp.processCommand(message);
    if (systemMessage) {
      $("#messages").append(divSystemContentElement(systemMessage));
    }
  } else {
    chatApp.sendMessage($("#room")).text(), message);
    $("#messages").append(divEscapedContentElement(message));
    $("#messages").scrollTop($("#messages").prop("scrollHeight"));
  }

  $("#send-message").val("");
}
