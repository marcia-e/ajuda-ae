  /* paste this line in verbatim */
  window.formbutton=window.formbutton||function(){
    (formbutton.q=formbutton.q||[]).push(arguments)
};
  /* customize formbutton below*/     
  formbutton("create", {
    action: "https://formspree.io/f/xwplqgwv",
    title: "Como podemos ajudar?",
    fields: [
      { 
        type: "email", 
        label: "Email:", 
        name: "email",
        required: true,
        placeholder: "Seu e-mail vai aqui"
      },
      {
        type: "textarea",
        label: "Mensagem:",
        name: "message",
        placeholder: "Sua dúvida vai aqui! ",
      },
      { type: "submit" }      
    ],
    styles: {
      title: {
        backgroundColor: "#f15b05"
      },
      button: {
        backgroundColor: "#f15b05"
      }
    }
  });