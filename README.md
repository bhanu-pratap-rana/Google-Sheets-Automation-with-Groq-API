# Google-Sheets-Automation-with-Groq-API

```markdown
# Google Sheets Automation with Groq API

This project demonstrates how to automate Google Sheets using Google Apps Script to generate responses based on user queries and moods. The script integrates with the Groq API to provide responses tailored to different moods.

## Table of Contents

- [Setup](#setup)
- [Usage](#usage)
- [Example Table](#example-table)
- [Documentation](#documentation)
  - [Setup](#setup)
  - [Usage](#usage)
  - [Functionality](#functionality)
  - [Customization](#customization)
- [Contributing](#contributing)
- [License](#license)

## Setup

1. **Create a Google Sheet**: Open Google Sheets and create a new spreadsheet.
2. **Set Up Columns**: Create a table with the following columns:
   - **A**: Questions
   - **B**: Select Mood (Dropdown)
   - **C**: Button (Checkbox)
   - **D**: Response

3. **Data Validation**: In the "Select Mood" column, add data validation options like "Happy," "Angry," "Drunk," etc.
4. **Checkboxes**: Add checkboxes in the "Button" column.
5. **Open Apps Script Editor**: Click on `Extensions` > `Apps Script` to open the editor.
6. **Add Script**: Replace any code in the editor with the provided script (see below).

```javascript
function atEdit(e) {
  var sheet = e.source.getActiveSheet();
  var range = e.range;
  
  if (range.getColumn() == 3 && range.getValue() === true) {
    var row = range.getRow();
    
    var question = sheet.getRange(row, 1).getValue();
    var mood = sheet.getRange(row, 2).getValue();
    
    if (question && mood) {
      var response = callGroqAPI(question, mood);
      Logger.log(response);
      sheet.getRange(row, 4).setValue(response);
    } else {
      sheet.getRange(row, 3).setValue(false);
      SpreadsheetApp.getUi().alert('Please fill both the question and mood before checking the box.');
    }
  }
}

function callGroqAPI(question, mood) {
  var url = "https://api.groq.com/openai/v1/chat/completions";
  
  var apiKey = "YOUR_API_KEY_HERE";
  
  var headers = {
    "Authorization": "Bearer " + apiKey,
    "Content-Type": "application/json"
  };
  
  var prompt = `For the following user query: ${question}
                You have to generate an answer like a intelligent human assistant with your understanding based on ${mood} mood.
                Take care of the below rules while answering.
                Rules:
                1. Ensure that you follow British English conventions, adhering to the oxford style guide.
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
    "muteHttpExceptions": true
  };
  
  try {
    var response = UrlFetchApp.fetch(url, options);
    Logger.log(response.getContentText());
    var jsonResponse = JSON.parse(response.getContentText());
    
    var content = jsonResponse.choices[0].message.content;
    Logger.log("Final Response: ", content);    
    return content;
    
  } catch (error) {
    Logger.log('Error: ' + error);
    return "Error occurred while fetching response.";
  }
}
```

## Usage

1. **Enter Data**: Fill the "Questions" and "Select Mood" columns.
2. **Select Checkbox**: Check the box in the "Button" column to trigger the script.
3. **Automatic Response**: The script will call the Groq API and populate the "Response" column with the generated response.

## Example Table

| Questions             | Select Mood | Button | Response |
|-----------------------|-------------|--------|----------|
| Where is Taj Mahal?   | Happy       | [ ]    |          |
| How are you?          | Happy       | [ ]    |          |
| What is a satellite?  | Happy       | [ ]    |          |
| Who is the PM of India?| Angry      | [ ]    |          |
| How are you?          | Angry       | [ ]    |          |
| Why am I looking dashing? | Happy  | [ ]    |          |
| Who am I?             | Drunk       | [ ]    |          |
| What is VPS?          | Angry       | [ ]    |          |
| I am good how are you?| Angry       | [ ]    |          |
| Bye                   | Angry       | [ ]    |          |
| What is the age of sun| Happy       | [ ]    |          |

## Documentation

### Setup

Follow the steps in the [Setup](#setup) section to configure your Google Sheet and add the necessary script.

### Usage

After setting up the sheet, fill in the questions and moods, and use the checkboxes to get automated responses.

### Functionality

- The script listens for changes in the checkbox column.
- When checked, it validates the question and mood.
- Calls the Groq API to get a response based on the mood.
- Populates the "Response" column with the generated response.

### Customization

Adjust the script as needed to fit your specific requirements, such as different API endpoints or additional data processing.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.
