function atEdit(e) {
    var sheet = e.source.getActiveSheet();
    var range = e.range;
   
    // Check if the edited cell is in column C (checkboxes)
    if (range.getColumn() == 3 && range.getValue() === true) {
      var row = range.getRow();
     
      var question = sheet.getRange(row, 1).getValue();  // Get question from column A
      var mood = sheet.getRange(row, 2).getValue();      // Get mood from column B
   
      // Ensure both question and mood are filled
      if (question && mood) {
        // Call Groq API to generate response
        var response = callGroqAPI(question, mood);  // Replace with actual API function
        Logger.log(response);
   
        // Place the result in column D
        sheet.getRange(row, 4).setValue(response);
      } else {
        // Uncheck the checkbox if the question or mood is missing
        sheet.getRange(row, 3).setValue(false);
        SpreadsheetApp.getUi().alert('Please fill both the question and mood before checking the box.');
      }
    }
  }
   
  function callGroqAPI(question, mood) {
    var url = "https://api.groq.com/openai/v1/chat/completions";  // Groq API endpoint
   
    var apiKey = "YOUR_API_KEY";  // Your Groq API key
   
    var headers = {
      "Authorization": "Bearer " + apiKey,
      "Content-Type": "application/json"
    };
   
    var prompt = `For the following user query: ${question}
                  You have to generate an answer like an intelligent human assistant with your understanding based on ${mood} mood.
                  Take care of the below rules while answering.
                  Rules:
                  1. Ensure that you follow British English conventions, adhering to the Oxford style guide.
                  2. Kindly refrain from shortening any web URLs provided in the responses.
                  3. Ensure that the response is concise and to the point.
                  4. Do not generate responses more than 50 words.
                  5. Ensure to generate response like a human, not like a machine.
                  6. Add some spelling mistakes in the response.`;
   
    var payload = {
      "model": "llama3-8b-8192",
      "messages": [
        {
          "role": "user",
          "content": prompt
        }
      ],
      "temperature": 0.7,
      "top_p": 0.95,
      "max_tokens": 500
    };
   
    var options = {
      "method": "post",
      "headers": headers,
      "payload": JSON.stringify(payload),
      "muteHttpExceptions": true  // This ensures errors are not thrown but returned in the response.
    };
   
    try {
      var response = UrlFetchApp.fetch(url, options);
      Logger.log(response.getContentText());  // Logs the response in the Google Apps Script console
      var jsonResponse = JSON.parse(response.getContentText());
   
      // Extract the content from the response
      var content = jsonResponse.choices[0].message.content;
      Logger.log("Final Response: " + content);    
      return content;  // Return the extracted content
   
    } catch (error) {
      Logger.log('Error: ' + error);
      return "Error occurred while fetching response.";
    }
  }
  
  