

export const Chatbot = () => {
  return (
    <>
      <script src="https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1"></script>
      <df-messenger
        intent="WELCOME"
        chat-title="TechTroveDecor_AI_Chat"
        agent-id="515b0ea2-7df5-48b6-8af0-56c68fa80c3b"
        language-code="vi"
      ></df-messenger>
    </>
  );
};

