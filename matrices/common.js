"introduction": {
    "correctAnswer": [],
    "path": "matrices/assets/introduction.md",
    "sidebarWidth": 0,
    "response": [
      {
        "id": "signature",
        "location": "belowStimulus",
        "placeholder": "Prolific ID",
        "prompt": "Please enter your Prolific ID",
        "type": "shortText",
        "style": { "margin": "0% 20% 0% 20%" }
      }
    ],
    "type": "markdown",
    "style": { "width": "auto", "margin": "0% 20% 0% 20%" },
    "nextButtonLocation": "belowStimulus"
  },
  "consent": {
    "correctAnswer": [],
    "path": "matrices/assets/consent.md",
    "sidebarWidth": 0,
    "response": [
      {
        "id": "accept",
        "location": "belowStimulus",
        "options": [
          {
            "label": "Decline",
            "value": "no"
          },
          {
            "label": "Accept",
            "value": "yes"
          }
        ],
        "prompt": "Do you consent to the study and wish to continue?",
        "requiredValue": "yes",
        "type": "radio",
        "style": { "margin": "0% 20% 0% 20%" }
      }
    ],
    "type": "markdown",
    "style": { "width": "auto", "margin": "0% 20% 0% 20%" }
  },
  "data_description": {
    "correctAnswer": [],
    "path": "matrices/assets/data.md",
    "sidebarWidth": 0,
    "response": [],
    "type": "markdown",
    "style": { "width": "auto", "margin": "0% 20% 0% 20%" }
  },
  "list2num": {
    "allowFailedTraining": false,
    "sidebarWidth": 0,
    "nextButtonLocation": "belowStimulus",
    "provideFeedback": true,
    "trainingAttempts": 2.0,
    "type": "questionnaire",
    "correctAnswer": [
      {
        "answer": "b",
        "id": "list2num"
      }
    ],
    "response": [
      {
        "id": "list2num",
        "location": "belowStimulus",
        "options": [
          {
            "label": "$160 \u00b1 $40",
            "value": "a"
          },
          {
            "label": "$200 \u00b1 $20",
            "value": "b"
          },
          {
            "label": "$220 \u00b1 $10",
            "value": "c"
          },
          {
            "label": "$270 \u00b1 $90",
            "value": "d"
          }
        ],
        "prompt": "Training: Which of the options showing mean and variation fits best to the list of flight prices.<br><br>Flight Prices: $200, $220, $205, $180",
        "type": "radio",
        "style": {
          "width": "auto",
          "margin": "0% 20% 0% 20%"
        }
      }
    ]
  },
  "num2list": {
    "allowFailedTraining": false,
    "sidebarWidth": 0,
    "correctAnswer": [
      {
        "answer": "c",
        "id": "num2list"
      }
    ],
    "nextButtonLocation": "belowStimulus",
    "provideFeedback": true,
    "response": [
      {
        "id": "num2list",
        "location": "belowStimulus",
        "options": [
          {
            "label": "$200, $230, $250, $195",
            "value": "a"
          },
          {
            "label": "$300, $230, $250, $200",
            "value": "b"
          },
          {
            "label": "$180, $200, $160, $200",
            "value": "c"
          },
          {
            "label": "$270, $180, $400, $230",
            "value": "d"
          }
        ],
        "prompt": "Training: Which list of prices fits best to the given route price mean\u00b1variation? <br><br>Route Price: $180 \u00b1 $20",
        "type": "radio",
        "style": {
          "width": "auto",
          "margin": "0% 20% 0% 20%"
        }
      }
    ],
    "trainingAttempts": 2.0,
    "type": "questionnaire"
  },
  "connectivity_description": {
    "correctAnswer": [],
    "path": "matrices/assets/connectivity.md",
    "sidebarWidth": 0,
    "response": [],
    "type": "markdown",
    "style": {
      "width": "auto",
      "margin": "0% 20% 0% 20%"
    }
  },
  "matrix2graph": {
    "allowFailedTraining": false,
    "correctAnswer": [
      {
        "answer": "2",
        "id": "option"
      }
    ],
    "instruction": "Which graph corresponds to the matrix?",
    "nextButtonLocation": "sidebar",
    "path": "matrices/assets/images/matrix2graph.svg",
    "provideFeedback": true,
    "response": [
      {
        "id": "option",
        "location": "sidebar",
        "options": [
          {
            "label": "1",
            "value": "1"
          },
          {
            "label": "2",
            "value": "2"
          },
          {
            "label": "3",
            "value": "3"
          },
          {
            "label": "None",
            "value": "4"
          }
        ],
        "prompt": "Select an option:",
        "type": "radio"
      }
    ],
    "trainingAttempts": 2.0,
    "type": "image"
  },
  "graph2matrix": {
    "allowFailedTraining": false,
    "correctAnswer": [
      {
        "answer": "3",
        "id": "option"
      }
    ],
    "instruction": "Which matrix corresponds to the graph?",
    "nextButtonLocation": "sidebar",
    "path": "matrices/assets/images/graph2matrix.svg",
    "provideFeedback": true,
    "response": [
      {
        "id": "option",
        "location": "sidebar",
        "options": [
          {
            "label": "1",
            "value": "1"
          },
          {
            "label": "2",
            "value": "2"
          },
          {
            "label": "3",
            "value": "3"
          },
          {
            "label": "None",
            "value": "4"
          }
        ],
        "prompt": "Select an option:",
        "type": "radio"
      }
    ],
    "style": {
      "width": "80%",
      "margin": "auto"
    },
    "trainingAttempts": 2.0,
    "type": "image"
  },