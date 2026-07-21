
// ============================================================
// SECTION 1: APP CLASS
// The core state manager. Defined first because everything depends on it.
// ============================================================
class App {
  constructor(element) {
    this.element = element;
    this.view = "view-title";
    this.module = 1;
    this.part = 1;
    this.question = 1;
    this.onboardingStep = 0;
    this.orientationStep = 0;
    this.pathway = '';
    this.level = 1;
    this.gamePhase = 'cartSort';
    this.cartSortAnswerKey = [];
    this.deliveryAnswerKey = [];
  }

  // sets a view and hides all others
  setView(className) {

    this.view = className;

    /* loops over each div that is a direct child
    of #app (body) whose class attribute
    starts with "view-" */
    this.element.children('[class^="view-"]').each(function () {
      // checks if current element is already hidden
      if ($(this).css('display') === 'none') {
      } else {
        /* if the element is visible, fade it out 200 ms and hide all views*/
        $(this).fadeOut(200);
      }
    });
    // after the loop, fade in the target view (200 ms)
    this.element.find($(`.${className}`)).fadeIn(200);
  }

  displayModal(correct, title, body, button) {
    let viewContainer = this.element.find($(`.${this.view}`));

    if (viewContainer.children(".modal-container").length) {
      const modal = $(`
                <div class="modal-background" style="display:none;">
                    <div class= "modal">
                        <span class="material-symbols-outlined ${correct ? 'icon-correct' : 'icon-incorrect'}">
                        ${correct ? "check_circle" : "cancel"}
                        </span>
                        <p class="modal-heading">${title}</p>
                        <p class="modal-body">${body}</p>
                        <button id="${button.id}">${button.text}</button>
                    </div>
                </div>
                `);

      viewContainer.children(`.modal-container`).append(modal);
      modal.fadeIn(200);
    }
  }

  hideModal() {
    $('.modal-background').fadeOut(200, function () {
      $(this).remove();
    })
  }
}

// ============================================================
// SECTION 2: IIFE — STATE & CONFIG INITIALIZATION
// Runs immediately. Creates the app instance and config data,
// and exposes them globally via getApp(), getConfig(), getLetterMatrix().
// Must come before any function that calls those getters.
// ============================================================

// self executes this function immediately
const appState = (function () {
  // create app instance for the whole application 
  const app = new App($('#app'));
  const letterMatrix = [
    ['B', 'BD', 'BF', 'BH', 'BR', 'BS'],
    ['C', 'CB', 'CE', 'CR', 'CS', 'CT'],
    ['G', 'GA', 'GE', 'GF', 'GR', 'GV'],
    ['H', 'HA', 'HB', 'HD', 'HG', 'HQ'],
    ['L', 'LB', 'LF', 'LH', 'LJ', 'LT']
  ];
  // content data for the app
  const config = {
    lcc: {
      onboarding: [
        { text: "Books don’t sit just anywhere. Every item in a collection has a precise location on the shelf - its home, waiting to be found." },
        { text: "Your job is to find that home address." },
        { text: "Every book’s home address is encoded in its call number: a string of letters and numbers that map to its exact location on the shelf." },
        { text: "Once you know how to read a call number, you can figure out where a book is located." },
        { text: "Here’s how training works:" },
        { text: "You’ll learn to read a call number one section at a time, starting broad and gradually getting more specific. At each stage, you’ll practice call number ordering before moving on." },
        { text: "Remember, call number ordering is the key to delivering a book to its correct location." }
      ],
      orientation: [
        { text: "A call number is the unique address of a book on the shelf. Every item in the collection has one and no two items share the same address." },
        { text: "Call numbers consist of letters, whole numbers, decimals, often a publication date, and occasionally a volume and/or copy number.", image: "images/callnumber.png" },
        { text: "The entire call number should be read as one line in a database." }, // image will go here later
        { text: "However, a call number on the physical item will be printed on the spine label and read from top to bottom." }, // image goes here later
        { text: "Every call number has two main parts, divided by a decimal point. Subject — everything before the decimal (identifies the broad topic area). Cutter — everything after the decimal (identifies the specific item)." },
        { text: "The more components a call number has, the more specific its address. Some call numbers include additional cutters, a publication year, a volume number, and/or a copy number." },
        { text: "Before you start training, there is one governing rule to know because it applies at every stage." },
        { text: "A shorter call number always comes before a longer one when all preceding elements match. This is called the 'Nothing before Something' rule." }
      ],
      training: {
        module1: {
          part1: {
            read: {
              heading: "Subject Letters",
              content: `<ul>
                            <li> The letter(s) at the start of a call number identify the broad subject area.</li>
                            <li>Sorted alphabetically</li>
                            <li>Single letters come before double letters with the same starting letter</li>
                            <li><strong>L &lt; LA &lt; LB &lt; N</strong></li>
                        </ul > `

            },
            question1: {
              heading: "Level 1: Single letters",
              text: "Sort subject letters",
              answer: ['B', 'H', 'L', 'M', 'P'],
              feedback: "Subject letters sort alphabetically."
            },
            question2: {
              heading: "Level 2: Single & double letters",
              text: "Sort subject letters",
              answer: ['B', 'BR', 'L', 'LA', 'LB'],
              feedback: "A single letter always comes before a double letter that starts with the same letter. L comes before LA and LB."
            },

            question3: {
              heading: "Level 3: Single & double letters, larger range",
              text: "Sort subject letters",
              answer: ['G', 'GN', 'M', 'P', 'PA', 'PB'],
              feedback: "A single letter always comes before a double letter that starts with the same letter. P comes before PA and PB."
            },
          },
          part2: {
            read: {
              heading: "Subject Numbers",
              content: `<ul>
                            <li>The number that follows the subject letters. It narrows the classification to a more specific topic within the subject area.</li>
                            <li>Sorted numerically: read as integers first, then by decimal. A whole number comes before the same number with a decimal extension.</li>
                            <li><strong>212 &lt; 212.16 &lt; 212.5 &lt; 213</strong></li>
                        </ul>`

            },
            question1: {
              heading: "Whole numbers, same letter prefix",
              text: "Sort subject letters + subject numbers",
              answer: ['L 73', 'L 100', 'L 250', 'L 412'],
              feedback: "Subject numbers sort as whole integers. 73 is less than 100, so 73 comes first."
            },

            question2: {
              heading: "Whole numbers & decimals mixed, same prefix",
              text: "Sort subject letters + subject numbers",
              answer: ['LA 100', 'LA 212', 'LA 212.16', 'LA 212.5'],
              feedback: "A whole number comes before its decimal extensions. .16 is less than .50, so 212.16 comes before 212.5"
            },
            question3: {
              heading: "Whole numbers & decimals mixed, different prefixes",
              text: "Sort subject letters + subject numbers",
              answer: ['Q 55', 'QA 10.5', 'QA 101', 'QB 300'],
              feedback: "When letter groups differ, sort by letter first: Q before QA, QA before QB. Within the same letter group, sort next by number."
            },
          }
        },
        module2: {
          part1: {
            read: {
              heading: "Cutter",
              content: `<ul>
                        <li>The part of the call number that follows the decimal point. Represents more specific classification within the main class.</li>
                        <li>Always starts with a period and a letter</li>
                        <li>Letters are sorted alphabetically: <strong>.R &lt; .S</strong></li>
                        <li>Numbers after the letter are read as fractions, not whole numbers</li>
                        <li><strong>.R23 &lt; .R3 &lt; .R423</strong></li>
                        <li>In the example above 0.23 is less than 0.30 which is less than 0.423</li>
                    </ul>`
            },
            question1: {
              heading: "Different cutter letters",
              text: "Sort subject letters + subject numbers + cutter number",
              answer: ['LA 212 .A13', 'LA 212 .B42', 'LA 212 .R5', 'LA 212 .S22'],
              feedback: "The letter after the decimal sorts alphabetically first: A before B, B before R, R before S."
            },
            question2: {
              heading: "Same cutter letter, different decimal fraction ",
              text: "Sort subject letters + subject numbers + cutter number",
              answer: ['PR 6019 .R1', 'PR 6019 .R23', 'PR 6019 .R3', 'PR 6019 .R423'],
              feedback: "After the cutter letter, read the number as a decimal fraction, not as whole numbers. .R1 = 0.10,  .R23 = 0.23,  .R3 = 0.30,  .R423 = 0.423"
            },
            question3: {
              heading: "Mixed cutter letters and tricky decimals",
              text: "Sort subject letters + subject numbers + cutter number",
              answer: ['HQ 1870 .A5', 'HQ 1870 .R23', 'HQ 1870 .R3', 'HQ 1870 .R423', 'HQ 1870 .S1'],
              feedback: "Sort by cutter letter first (A before R, R before S). Within the same cutter letter, treat the numbers as fractions. .R23 before .R3 and .R3 before .R423"
            }
          },
          part2: {
            read: {
              heading: "Additional Cutters",
              content: `<ul>
                            <li>Some call numbers have multiple cutter numbers, particularly in subjects with an abundance of material.</li>
                            <li>Each subsequent cutter number follows the same sorting rules as the first: alphabetical, then decimal fractions.</li>
                            <li><strong>.R423 B55</strong></li>
                            <li><strong>.R423 A2 &lt; .R423 B55</strong></li>
                        </ul>`
            },
            question1: {
              heading: "Different additional cutter letters",
              text: "Sort subject letters + subject numbers + cutter number + additional cutter",
              answer: ['GV 706 .R423 A12', 'GV 706 .R423 G2214', 'GV 706 .R423 M34', 'GV 706 .R423 S55'],
              feedback: "The additional cutter sorts alphabetically by letter, just like the main cutter."
            },
            question2: {
              heading: "Same additional cutter letter, decimal fraction differences",
              text: "Sort subject letters + subject numbers + cutter number + additional cutter",
              answer: ['BF 408 .R423 H127', 'BF 408 .R423 H3', 'BF 408 .R423 H52', 'BF 408 .R423 H5579'],
              feedback: "The numbers in an additional cutter are decimal fractions, just like the main cutter. H127 = 0.127,  H3 = 0.30,  H52 = 0.52"
            },
            question3: {
              heading: "With and without additional cutter mixed",
              text: "Sort subject letters + subject numbers + cutter number + additional cutter",
              answer: ['DS 135 .S55', 'DS 135 .S55 A12', 'DS 135 .S55 A212', 'DS 135 .S55 H378', 'DS 135 .S55 H52'],
              feedback: "A call number with no additional cutter comes before one that has one."
            }
          }
        },
        module3: {
          part1: {
            read: {
              heading: "Publication Year",
              content: `<ul>
                            <li>Appears at the end of a call number, indicates the year the item was published.</li>
                            <li>Occasionally, the year may appear <strong>before</strong> the cutter.</li>
                            <li>Sorted chronologically: earlier year first.</li>
                            <li><strong>1978 &lt; 2007</strong></li>
                         </ul>`
            },
            question1: {
              heading: "Same base, different years",
              text: "Sort subject letters + subject numbers + cutter number + additional cutter + publication year",
              answer: ['LA 212 .R423', 'LA 212 .R423 2005', 'LA 212 .R423 2010', 'LA 212 .R423 2022'],
              feedback: "A call number with no year shelves before its dated edition. Dated editions sort chronologically. "
            },
            question2: {
              heading: "Mixed shelf, some with years",
              text: "Sort subject letters + subject numbers + cutter number + additional cutter + publication year",
              answer: ['BF 408 .C55', 'BF 408 .C55 2014', 'BF 408 .H3 2009', 'BF 408 .S22'],
              feedback: "Sort by cutter first. When two items share the same cutter, the one without a year shelves first. Notice that .H3 has a year but still shelves before .S22, which has none. A year only affects placement when two items share the same cutter."
            },
            question3: {
              heading: "Mixed shelf, some with years",
              text: "Sort subject letters + subject numbers + cutter number + additional cutter + publication year",
              answer: ['PS 1234 .A3', 'PS 1234 .A3 1995', 'PS 1234 .A3 2008', 'PS 1234 .B12 2001', 'PS 1234 .C44'],
              feedback: "Sort by cutter first. .A3 comes before .B12, .B12 comes before .C44. Within the same .A3 group, no year shelves first, then sort the rest chronologically. .B12 has a year and .C44 does not, but .B12 still shelves first because B comes before C."
            }
          },
          part2: {
            read: {
              heading: "Volume/Copy",
              content: `<ul>
                            <li>Appears at the end of a call number, indicates which volume or copy of a work the item is. Volume refers to an item in a multi-volume series, whereas copy refers to a duplicate of the same item.</li>
                            <li>Sorted numerically: lowest number first.</li>
                            <li><strong>v.1 &lt; v.2 &lt; v.3</strong></li>
                            <li><strong>c.1 &lt; c.2</strong></li>
                        </ul>`
            },
            question1: {
              heading: "Same base, different volumes",
              text: "Sort subject letters + subject numbers + cutter number + publication year + volume/copy",
              answer: ['HQ 1870 .A5 v.1', 'HQ 1870 .A5 v.2', 'HQ 1870 .A5 v.3'],
              feedback: "When the entire base call number is identical, volumes sort numerically. v.1 comes before v.2, which comes before v.3."
            },
            question2: {
              heading: "With and without volume, same base",
              text: "Sort subject letters + subject numbers + cutter number + publication year + volume/copy",
              answer: ['GV 706 .R423 M34', 'GV 706 .R423 M34 v.1', 'GV 706 .R423 M34 v.2', 'GV 706 .R423 M34 v.3'],
              feedback: "A call number without a volume designation comes before the same call number with one. Among volumes, sort numerically: v.1 before v.2 before v.3."
            },
            question3: {
              heading: "Mixed volumes and copies",
              text: "Sort subject letters + subject numbers + cutter number + publication year + volume/copy",
              answer: ['BF 408 .C55 2014', 'BF 408 .C55 2014 c.1', 'BF 408 .C55 2014 c.2', 'BF 408 .H3 2009 v.1', 'BF 408 .H3 2009 v.2', 'BF 408 .S22'],
              feedback: "Sort by cutter letter first (.C before .H, .H before .S). When cutters match, items without volume/copy come before those with them. Among copies or volumes, sort numerically."
            },
          }
        }
      },

      practice: {
        level1: {
          cartSort: {
            heading: "Task 1: Cart Sort",
            text: "Arrange books on the cart and click submit when done to check work. ",
            answer: ["BC38 .H59", "BF713 .S53 2022", "BP605 .S2 S35 1992", "DA356 .S77 2001b", "DS771 .P73 2000", "E185.93 .L6 F35 1999", "HD41 .W494 1997", "HM851 .E24 2010", "HQ1061 .N65", "JF799 .F85 2018"]
          },
          delivery: {
            heading: "Task 2: Shelf Sort",
            text: "placeholder",
            answer: ['PLACEHOLDER']
          }
        },
        level2: {
          cartSort: {
            heading: "Task 1: Cart Sort",
            text: "",
            answer: ["BF1655 .L485 1994B", "BR515 .A4 1972", "DD253.5 .B37 2005", "E185.93 .A3 T48 2002", "F1219.8 .Z37 M37 1996", "GF125 .K67", "GN365.9 .S6", "GN400 .T8 1958 PT.1", "HC105 .L43 1984", "LB2342 .I52 2002"]
          },
          delivery: {
            heading: "Task 2: Shelf Sort",

          }
        },
        level3: {
          cartSort: {
            heading: "Task 1: Cart Sort",
            text: "",
            answer: ["HQ770.4 .S54 1980b", "KF229 .O24 C46 2016", "ML506 .G54 1997", "N6494 .C63 L56 1997", "PR2400 .A5 R4 1981", "PR6051 .D345 W3 1972", "QA9.4 .E47 1996", "QA445 .W35 1998", "TR654 .S477 1984", "U102 .D835 1983"]

          },
          delivery: {
            heading: "Task 2: Shelf Sort",

          }
        },
        level4: {
          cartSort: {
            heading: "Task 1: Cart Sort",
            text: "",
            answer: ["HD58.9 .I473 1994", "HD59 .H64 1994", "HD59 .S365 2012", "HD59.5 .H42 1997", "HD60 .I77 1996", "HD60.5 .U5 .P6", "HD62.15 .A57 1995", "HD62.15 .M47 1997", "HF32 .A53", "HF32 .B2"]

          },
          delivery: {
            heading: "Task 2: Shelf Sort",

          }
        },
        level5: {
          cartSort: {
            heading: "Task 1: Cart Sort",
            text: "",
            answer: ["BV507 .E8 W65", "DH107 .I87 1995", "GV1469.3 .P66 2000", "HD69 .B7 A216 1996", "HD69 .B7 P647 2012", "HD69 .P75 D57 1990", "HD69 .S8 S9 1998", "HD69 .T54 S4513 1989", "HD1375 .G728", "HD1492 .S65 E43 1984"]

          },
          delivery: {
            heading: "Task 2: Shelf Sort",
          }
        },
        level6: {
          cartSort: {
            heading: "Task 1: Cart Sort",
            text: "",
            answer: ["DA315 .O94 1996", "DA355 .S63 1991", "E185.97 .K5 A2 1992 V.1", "E185.97 .K5 A2 1992 V.2", "E185.97 .K5 E44 2023", "E185.97 .K5 G36 1999", "E185.97 .K5 K5", "E332.74 .G67 2008", "E841 .K34 2011", "HF1418.5 .R6425 2011"]

          },
          delivery: {
            heading: "Task 2: Shelf Sort",

          }
        }
      }
    },

    dewey: {
      onboarding: [
        { text: "Books don’t sit just anywhere. Every item in a collection has a precise location on the shelf - its home, waiting to be found." },
        { text: "Your job is to find that home address." },
        { text: "Every book’s home address is encoded in its call number: a string of letters and numbers that map to its exact location on the shelf." },
        { text: "Once you know how to read a call number, you can figure out where a book is located." },
        { text: "Here’s how training works:" },
        { text: "You’ll learn to read a call number one section at a time, starting broad and gradually getting more specific. At each stage, you’ll practice call number ordering before moving on." },
        { text: "Remember, call number ordering is the key to delivering a book to its correct location." }
      ],
      orientation: [
        { text: "Most public libraries, primary, and secondary schools use the Dewey Decimal Classification system to organize their materials." },
        { text: "Collections are often divided into fiction and non-fiction sections, with the non-fiction section organized by the DDC numerical structure." },
        { text: "Call numbers within the Dewey Decimal system use a string of numbers representing the subject or class that the material falls in." },
        { text: "These are the 10 main classes in the system: " },
        { text: "For fiction materials, these libraries often organize the collection by the author's last name instead of the class system." },
        { text: "The call number consists of the subject abbrieviation followed by the author's last name." }
      ],
      training: {
        module1: {
          part1: {
            read: {
              heading: "Class Numbers",
              content: `<ul> 
              <li>The number at the start of a call number identifies the subject. There are 10 main classes:</li>
              <li>000 Computer Science, Information and General Works</li>
              <li>100 Philosophy and Psychology</li>
              <li>200 Religion</li>
              <li>300 Social Sciences</li>
              <li>400 Language</li>
              <li>500 Science</li>
              <li>600 Technology</li>
              <li>700 Arts and Recreation</li>
              <li>800 Literature</li>
              <li>900 History and Geography</li>
              </ul>`
            },
            question1: {
              heading: "",
              text: "",
              answer: [],
              feedback: ""
            },
            question2: {
              heading: "",
              text: "",
              answer: [],
              feedback: ""
            },
            question3: {
              heading: "",
              text: "",
              answer: [],
              feedback: ""
            }
          },
          part2: {
            read: {
              heading: "",
              content: ""
            },
            question1: {
              heading: "",
              text: "",
              answer: [],
              feedback: ""
            },
            question2: {
              heading: "",
              text: "",
              answer: [],
              feedback: ""
            },
            question3: {
              heading: "",
              text: "",
              answer: [],
              feedback: ""
            }
          }
        },
        module2: {
          part1: {
            read: {
              heading: "",
              content: ""
            },
            question1: {
              heading: "",
              text: "",
              answer: [],
              feedback: ""
            },
            question2: {
              heading: "",
              text: "",
              answer: [],
              feedback: ""
            },
            question3: {
              heading: "",
              text: "",
              answer: [],
              feedback: ""
            }
          },
          part2: {
            read: {
              heading: "",
              content: ""
            },
            question1: {
              heading: "",
              text: "",
              answer: [],
              feedback: ""
            },
            question2: {
              heading: "",
              text: "",
              answer: [],
              feedback: ""
            },
            question3: {
              heading: "",
              text: "",
              answer: [],
              feedback: ""
            }
          },
          part3: {
            read: {
              heading: "",
              content: ""
            },
            question1: {
              heading: "",
              text: "",
              answer: [],
              feedback: ""
            },
            question2: {
              heading: "",
              text: "",
              answer: [],
              feedback: ""
            },
            question3: {
              heading: "",
              text: "",
              answer: [],
              feedback: ""
            }
          }
        }
      }
    },

    practice: {
      level1: {
        cartSort: {

        },
        delivery: {

        }
      },
      level2: {
        cartSort: {

        },
        delivery: {

        }
      },
      level3: {
        cartSort: {

        },
        delivery: {

        }
      },
      level4: {
        cartSort: {

        },
        delivery: {

        }
      },
      level5: {
        cartSort: {

        },
        delivery: {

        }
      },
      level6: {
        cartSort: {

        },
        delivery: {

        }
      }
    }
  }

  return { app, config, letterMatrix };
})();

window.getApp = () => appState.app;
window.getConfig = () => appState.config;
window.getLetterMatrix = () => appState.letterMatrix;


// ============================================================
// SECTION 3: SCREEN LOADER FUNCTIONS
// These populate views with content from the config.
// Ordered by the flow a user experiences:
//   Title → Onboarding → Orientation → Module Overview → Quiz → Practice
// ============================================================

function animateTextIn(element) {
  const myApp = getApp();
  let buttonTarget;
  if (myApp.view === 'view-onboarding') {
    buttonTarget = $('#onboarding-next');
  } else if (myApp.view === 'view-orientation') {
    buttonTarget = $('#orientation-next');
  }
  buttonTarget.css('display', 'none');
  const animatedElement = $(element);
  const storedText = animatedElement.text();
  const animationSpeed = 2;
  animatedElement.height('unset');
  animatedElement.width('unset');
  animatedElement.height(animatedElement.height());
  animatedElement.width(animatedElement.width());
  animatedElement.text('');
  animatedElement.css('display', 'inline-block');
  let i = 0;
  let timer = setInterval(function () {
    if (i + 1 > storedText.length) {
      animatedElement.text(`${animatedElement.text() + storedText.charAt(i)}`);
      clearInterval(timer);
      buttonTarget.fadeIn(0);
    } else if (i + 2 > storedText.length) {
      animatedElement.text(`${animatedElement.text() + storedText.charAt(i) + storedText.charAt(i + 1)}`);
      clearInterval(timer);
      buttonTarget.fadeIn(0);
    } else {
      animatedElement.text(`${animatedElement.text() + storedText.charAt(i) + storedText.charAt(i + 1)}`);
    }
    i = i + 2;
  }, animationSpeed);
}

function loadOnboarding() {
  const myApp = getApp();
  const config = getConfig();

  // display current step text
  const step = config[myApp.pathway].onboarding[myApp.onboardingStep];
  $("#onboarding-text").text(step.text);
  animateTextIn($('#onboarding-text'));

  // increment step for next click
  myApp.onboardingStep++;
}

function loadOrientation() {
  const myApp = getApp();
  const config = getConfig();

  const step = config[myApp.pathway].orientation[myApp.orientationStep];
  $("#orientation-text").text(step.text);
  animateTextIn($('#orientation-text'));

  if (step.image) {
    $('#call-number-diagram').attr('src', step.image).show();
  } else {
    $('#call-number-diagram').hide();
  }

  myApp.orientationStep++;
}

function loadModuleOverview() {
  const myApp = getApp();
  const config = getConfig();
  let moduleIteration = 1;

  $(`#overview-cards`).empty();

  for (let module in config[myApp.pathway].training) {
    let partIteration = 1;
    let completed = false;
    let moduleCard = $(`
            <div class="module-card">
            <p class="module-title">Module ${moduleIteration}</p>
            </div>
        `);
    if (myApp.module > moduleIteration) {
      completed = true;
    }
    for (let part in config[myApp.pathway].training[module]) {
      let completedPart = false;
      if ((myApp.module === moduleIteration && myApp.part > partIteration) || completed) {
        completedPart = true;
      }
      let partCard = $(`

                <div class ="part-section" completed="${completedPart}">
                <span class="material-symbols-outlined">${completedPart ? "check_circle" : "radio_button_unchecked"}</span>
                <p><strong>Part ${partIteration}: </strong>${config[myApp.pathway].training[module][part].read.heading}</p>

                </div>

            `);
      moduleCard.append(partCard);
      partIteration++;
    }
    $(`#overview-cards`).append(moduleCard);
    moduleIteration++;
  }
}

function loadRead() {
  const myApp = getApp();
  const config = getConfig();

  const readContent = config[myApp.pathway].training[`module${myApp.module}`][`part${myApp.part}`].read;
  if (myApp.part === 2) {
    $("#progress-bar").attr("progress", 4);
  }

  $("#read-eyebrow").text(`Module ${myApp.module}`);
  $("#read-heading").text(readContent.heading);
  $("#read-content").html(readContent.content);
}

// reads the current question from config and populates the quiz view
function loadQuiz() {
  // access config
  const config = getConfig();
  // select the view-quiz div and saves to viewElement variable
  const viewElement = $('.view-quiz');
  // access app instance
  const myApp = getApp();
  // sets h2 to the text found in heading key in config for the current view state in app instance
  viewElement.find('.quiz-heading').text(config[myApp.pathway].training[`module${myApp.module}`][`part${myApp.part}`][`question${myApp.question}`].heading);
  // sets p to the text found in text key in config for the current view state in app instance
  viewElement.find('.quiz-body').text(config[myApp.pathway].training[`module${myApp.module}`][`part${myApp.part}`][`question${myApp.question}`].text);
  // calls createBooks by passing in viewElement and the answer key content in config for the current view state in app instance
  createBooks(viewElement, config[myApp.pathway].training[`module${myApp.module}`][`part${myApp.part}`][`question${myApp.question}`].answer);

  $("#progress-bar").attr("progress", myApp.part * 3 - 3 + myApp.question);
}

function loadPracticeOverview() {
  const myApp = getApp();
  const config = getConfig();

  const phases = ['cartSort', 'delivery'];
  const phaseLabels = {
    cartSort: 'Cart Sort',
    delivery: 'Delivery'
  };

  const currentPhaseIndex = phases.indexOf(myApp.gamePhase);

  $('#practice-overview-cards').empty();

  let levelIteration = 1;

  for (let level in config[myApp.pathway].practice) {
    let levelCard;

    if (levelIteration < myApp.level) {
      levelCard = $(`
        <div class ="module-card">
          <div class="part-section" completed="true">
            <span class="material-symbols-outlined">check_circle</span>
            <p><strong>Level ${levelIteration}</strong></p>
          </div>
        </div>
      `);
    } else if (levelIteration === myApp.level) {
      levelCard = $(`
        <div class="module-card">
          <p class="module-title">Level ${levelIteration}</p>
        </div>
      `)

      for (let i = 0; i < phases.length; i++) {
        let phaseCompleted = i < currentPhaseIndex;
        let phaseCurrent = i === currentPhaseIndex;
        let icon = phaseCompleted ? 'check_circle' : phaseCurrent ? 'pending' : 'radio_button_unchecked';
        let completedAttr = phaseCompleted ? 'true' : 'false';

        let phaseCard = $(`
          <div class="part-section" completed="${completedAttr}">
            <span class="material-symbols-outlined">${icon}</span>
            <p>${phaseLabels[phases[i]]}</p>
          </div>
        `)
        levelCard.append(phaseCard);
      }
    } else {
      levelCard = $(`
        <div class="module-card">
          <div class="part-section" completed="false">
            <span class="material-symbols-outlined">radio_button_unchecked</span>
            <p><strong>Level ${levelIteration}</strong></p>
          </div>
        </div>
      `);
    }

    $('#practice-overview-cards').append(levelCard);
    levelIteration++;
  }
}

function loadPractice() {

  const config = getConfig();

  const viewElement = $('.view-practice');

  const myApp = getApp();

  viewElement.find('.practice-heading').text(config[myApp.pathway].practice[`level${myApp.level}`][myApp.gamePhase].heading);

  viewElement.find('.practice-body').text(config[myApp.pathway].practice[`level${myApp.level}`][myApp.gamePhase].text);

  let shuffledAnswer = shuffleLevel();

  myApp[`${myApp.gamePhase}AnswerKey`] = shuffledAnswer;

  createBooks(viewElement, shuffledAnswer);
}

// ============================================================
// SECTION 4: ANSWER CHECKING FUNCTIONS
// Called when the user submits an answer.
// ============================================================

function checkQuizAnswers() {
  // access config
  const config = getConfig();
  // access app instance
  const myApp = getApp();
  // access answer key for current view state in the config and save to answerKey array variable
  const answerKey = config[myApp.pathway].training[`module${myApp.module}`][`part${myApp.part}`][`question${myApp.question}`].answer;
  // convert user's book list to an array
  const userAnswers = $('.view-quiz').find($('.book')).toArray();
  // set correct variable to 0
  let correct = 0;

  // loop through the answerKey array
  for (let i = 0; i < answerKey.length; i++) {
    if (answerKey[i] === $(userAnswers[i]).find('p').text()) {
      correct++;
    } else {
      break;
    }
  }

  let element;
  /* if correct counter is equal to the answerKey length,
  then all answers are correct and user gets feedback and next button */
  if (correct === answerKey.length) {
    // grab feedback from config for current view
    const feedback = config[myApp.pathway].training[`module${myApp.module}`][`part${myApp.part}`][`question${myApp.question}`].feedback;
    // element = $(`<p id="quiz-feedback">${feedback}</p><button id="quiz-next">Next</button>`);
    myApp.displayModal(true, 'Correct!', feedback, { text: 'Next', id: 'quiz-next' });
    /* otherwise, if correct counter is not equal to the answerKey length,
    then user gets a try again button  */
  } else {
    // element = $('<p></p><button id="quiz-try-again">Try Again</button>');
    myApp.displayModal(false, 'Not quite!', 'Double check the order and try again.', { text: 'Try again', id: 'quiz-try-again' });
  }
  // clears the submit button
  // $("#quiz-message").empty();
  // adds the element (either a next + feedback or try again)
  // $("#quiz-message").append(element);
}

function checkPracticeAnswers() {
  const myApp = getApp();
  const answerKey = myApp[`${myApp.gamePhase}AnswerKey`];
  const userAnswers = $('.view-practice').find('.book').toArray();

  let correct = 0;

  for (let i = 0; i < answerKey.length; i++) {
    if (answerKey[i] === $(userAnswers[i]).find('p').text()) {
      correct++;
    } else {
      break;
    }
  }

  if (correct === answerKey.length) {
    myApp.displayModal(true, 'Correct!', 'Great Work! Move on to the next job.', { text: 'Next', id: 'practice-next' });
  } else {
    myApp.displayModal(false, 'Not quite!', 'You will be deployed to a new job and can try again.', { text: 'Try again', id: 'practice-try-again' });
  }
}

// ============================================================
// SECTION 5: PROGRESSION FUNCTIONS
// Control what happens after a correct answer — what loads next.
// ============================================================

// advances the screen state to the next question, part, or module
function incrementQuiz() {
  // access app
  const myApp = getApp();
  // access config data
  const config = getConfig();
  // save module variable in app to currentModule (starts at 1)
  const currentModule = myApp.module;
  // save part variable in app to currentPart (starts at 1)
  const currentPart = myApp.part;
  // save question variable in app to currentQuestion (starts at 1)
  const currentQuestion = myApp.question;

  /* grabs the question keys and puts them in an array of length 3
   (there are 3 questions in the part).
   check if 3 is greater than the currentQuestion number (starts at 1)
   */
  if (Object.keys(config[myApp.pathway].training[`module${myApp.module}`][`part${myApp.part}`]).length - 1 > currentQuestion) {
    // move to the next question in the same part if 3 is greater than currentQuestion
    myApp.question++;
  } else {
    /* if currentQuestion is 3, grab the part keys in the module
    and put them in an array of length 2 (there are 2 parts in the module)
    check if 2 is greater than the currentPart number (starts at 1)*/
    if (Object.keys(config[myApp.pathway].training[`module${myApp.module}`]).length > currentPart) {
      // if on question 3 of part 1, then set question to 1 and increment part to 2
      myApp.question = 1;
      myApp.part++;
      myApp.setView('view-module-overview');
      loadModuleOverview();
    } else {
      /* if  currentQuestion is 3 and part is 2, grab the module keys in the config
      and put them in an array of length 3 (there are 3 modules).
      check if 3 is greater than currentModule number (starts at 1)*/
      if (Object.keys(config[myApp.pathway].training).length > currentModule) {
        // set question to 1, part to 1, and increment module by 1
        myApp.question = 1;
        myApp.part = 1;
        myApp.module++;
        myApp.setView('view-module-overview');
        loadModuleOverview();
      } else {
        // if none of these conditions are met (on the final question in the final part of the final module), return false
        myApp.setView('view-practice-overview');
        loadPracticeOverview();
      }
    }
    // if one of the conditions are met, return true
  } return true;
}

function incrementPractice() {
  const myApp = getApp();
  const config = getConfig();
  const currentLevel = myApp.level;
  const currentPhase = myApp.gamePhase;

  const phases = ['cartSort', 'delivery'];
  const currentPhaseIndex = phases.indexOf(currentPhase);

  // if there are more phases in this level, move to the next one
  if (currentPhaseIndex < phases.length - 1) {
    myApp.gamePhase = phases[currentPhaseIndex + 1];
    loadPractice();
  } else {
    // all phases done — check if there are more levels
    if (Object.keys(config[myApp.pathway].practice).length > currentLevel) {
      // reset phase and increment level
      myApp.gamePhase = 'cartSort';
      myApp.level++;
      myApp.setView('view-practice-overview');
      loadPracticeOverview();
    } else {
      myApp.setView('view-end');
    }
  }
  return true;
}

// ============================================================
// SECTION 6: UTILITY / HELPER FUNCTIONS
// Supporting functions used by loaders and progression above.
// No direct user interaction — called by other functions.
// ============================================================

/* shuffles answer array and display a book for each call number.
        element is the quiz view and answer is the correct answer array from config
        */
function createBooks(element, answer) {
  const decoration = [
    $(`<svg preserveAspectRatio="none" class="book-decoration" width="100%" height="100%" viewBox="0 0 106 449" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="106" height="449" fill="url(#paint0_linear_336_572)" fill-opacity="0.2"/>
                    <rect x="33" y="75.4241" width="28.8839" height="28.8839" rx="2" transform="rotate(-45 33 75.4241)" stroke="url(#paint1_linear_336_572)" stroke-width="3" stroke-linejoin="round"/>
                    <rect x="33" y="150.272" width="28.8839" height="28.8839" rx="2" transform="rotate(-45 33 150.272)" stroke="url(#paint2_linear_336_572)" stroke-width="3" stroke-linejoin="round"/>
                    <rect x="33" y="225.12" width="28.8839" height="28.8839" rx="2" transform="rotate(-45 33 225.12)" stroke="url(#paint3_linear_336_572)" stroke-width="3" stroke-linejoin="round"/>
                    <rect x="33" y="299.968" width="28.8839" height="28.8839" rx="2" transform="rotate(-45 33 299.968)" stroke="url(#paint4_linear_336_572)" stroke-width="3" stroke-linejoin="round"/>
                    <rect x="33" y="374.816" width="28.8839" height="28.8839" rx="2" transform="rotate(-45 33 374.816)" stroke="url(#paint5_linear_336_572)" stroke-width="3" stroke-linejoin="round"/>
                    <defs>
                        <linearGradient id="paint0_linear_336_572" x1="106" y1="224.5" x2="0" y2="224.5" gradientUnits="userSpaceOnUse">
                            <stop/>
                            <stop offset="0.25" stop-opacity="0.407407"/>
                            <stop offset="0.75" stop-opacity="0"/>
                            <stop offset="0.985577" stop-opacity="0.25"/>
                        </linearGradient>
                        <linearGradient id="paint1_linear_336_572" x1="47.4419" y1="75.4241" x2="47.4419" y2="104.308" gradientUnits="userSpaceOnUse">
                            <stop stop-color="#FFDFA3"/>
                            <stop offset="1" stop-color="#FFCF76"/>
                        </linearGradient>
                        <linearGradient id="paint2_linear_336_572" x1="47.4419" y1="150.272" x2="47.4419" y2="179.156" gradientUnits="userSpaceOnUse">
                            <stop stop-color="#FFDFA3"/>
                            <stop offset="1" stop-color="#FFCF76"/>
                        </linearGradient>
                        <linearGradient id="paint3_linear_336_572" x1="47.4419" y1="225.12" x2="47.4419" y2="254.004" gradientUnits="userSpaceOnUse">
                            <stop stop-color="#FFDFA3"/>
                            <stop offset="1" stop-color="#FFCF76"/>
                        </linearGradient>
                        <linearGradient id="paint4_linear_336_572" x1="47.4419" y1="299.968" x2="47.4419" y2="328.852" gradientUnits="userSpaceOnUse">
                            <stop stop-color="#FFDFA3"/>
                            <stop offset="1" stop-color="#FFCF76"/>
                        </linearGradient>
                        <linearGradient id="paint5_linear_336_572" x1="47.4419" y1="374.816" x2="47.4419" y2="403.7" gradientUnits="userSpaceOnUse">
                            <stop stop-color="#FFDFA3"/>
                            <stop offset="1" stop-color="#FFCF76"/>
                        </linearGradient>
                    </defs>
                </svg>`),
    $(`<svg preserveAspectRatio="none" class="book-decoration" width="100%" height="100%" viewBox="0 0 98 487" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="98" height="487" fill="url(#paint0_linear_336_570)" fill-opacity="0.2"/>
                    <rect y="42" width="100%" height="11" fill="url(#paint1_linear_336_570)"/>
                    <rect y="434" width="100%" height="11" fill="url(#paint2_linear_336_570)"/>
                    <defs>
                        <linearGradient id="paint0_linear_336_570" x1="98" y1="243.5" x2="0" y2="243.5" gradientUnits="userSpaceOnUse">
                            <stop/>
                            <stop offset="0.25" stop-opacity="0.407407"/>
                            <stop offset="0.75" stop-opacity="0"/>
                            <stop offset="0.985577" stop-opacity="0.25"/>
                        </linearGradient>
                        <linearGradient id="paint1_linear_336_570" x1="0" y1="47.5" x2="98" y2="47.5" gradientUnits="userSpaceOnUse">
                            <stop stop-color="#FFCF76"/>
                            <stop offset="0.25" stop-color="#FFDFA3"/>
                            <stop offset="0.75" stop-color="#FFDFA3"/>
                            <stop offset="1" stop-color="#FFCF76"/>
                        </linearGradient>
                        <linearGradient id="paint2_linear_336_570" x1="0" y1="439.5" x2="98" y2="439.5" gradientUnits="userSpaceOnUse">
                            <stop stop-color="#FFCF76"/>
                            <stop offset="0.25" stop-color="#FFDFA3"/>
                            <stop offset="0.75" stop-color="#FFDFA3"/>
                            <stop offset="1" stop-color="#FFCF76"/>
                        </linearGradient>
                    </defs>
                </svg>`),
    $(`<svg preserveAspectRatio="none" class="book-decoration" width="100%" height="100%" viewBox="0 0 106 449" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="106" height="449" fill="url(#paint0_linear_336_571)" fill-opacity="0.2"/>
                        <rect x="14" y="23" width="77" height="53" stroke="url(#paint1_linear_336_571)" stroke-width="3" stroke-linejoin="round"/>
                        <rect x="14" y="93" width="77" height="53" stroke="url(#paint2_linear_336_571)" stroke-width="3" stroke-linejoin="round"/>
                        <rect x="14" y="163" width="77" height="53" stroke="url(#paint3_linear_336_571)" stroke-width="3" stroke-linejoin="round"/>
                        <rect x="14" y="233" width="77" height="53" stroke="url(#paint4_linear_336_571)" stroke-width="3" stroke-linejoin="round"/>
                        <rect x="14" y="303" width="77" height="53" stroke="url(#paint5_linear_336_571)" stroke-width="3" stroke-linejoin="round"/>
                        <rect x="14" y="373" width="77" height="53" stroke="url(#paint6_linear_336_571)" stroke-width="3" stroke-linejoin="round"/>
                        <defs>
                        <linearGradient id="paint0_linear_336_571" x1="106" y1="224.5" x2="0" y2="224.5" gradientUnits="userSpaceOnUse">
                            <stop/>
                            <stop offset="0.25" stop-opacity="0.407407"/>
                            <stop offset="0.75" stop-opacity="0"/>
                            <stop offset="0.985577" stop-opacity="0.25"/>
                        </linearGradient>
                        <linearGradient id="paint1_linear_336_571" x1="14" y1="49.5" x2="91" y2="49.5" gradientUnits="userSpaceOnUse">
                            <stop stop-color="#FFDFA3"/>
                            <stop offset="1" stop-color="#FFCF77"/>
                        </linearGradient>
                        <linearGradient id="paint2_linear_336_571" x1="14" y1="119.5" x2="91" y2="119.5" gradientUnits="userSpaceOnUse">
                            <stop stop-color="#FFDFA3"/>
                            <stop offset="1" stop-color="#FFCF77"/>
                        </linearGradient>
                        <linearGradient id="paint3_linear_336_571" x1="14" y1="189.5" x2="91" y2="189.5" gradientUnits="userSpaceOnUse">
                            <stop stop-color="#FFDFA3"/>
                            <stop offset="1" stop-color="#FFCF77"/>
                        </linearGradient>
                        <linearGradient id="paint4_linear_336_571" x1="14" y1="259.5" x2="91" y2="259.5" gradientUnits="userSpaceOnUse">
                            <stop stop-color="#FFDFA3"/>
                            <stop offset="1" stop-color="#FFCF77"/>
                        </linearGradient>
                        <linearGradient id="paint5_linear_336_571" x1="14" y1="329.5" x2="91" y2="329.5" gradientUnits="userSpaceOnUse">
                            <stop stop-color="#FFDFA3"/>
                            <stop offset="1" stop-color="#FFCF77"/>
                        </linearGradient>
                        <linearGradient id="paint6_linear_336_571" x1="14" y1="399.5" x2="91" y2="399.5" gradientUnits="userSpaceOnUse">
                            <stop stop-color="#FFDFA3"/>
                            <stop offset="1" stop-color="#FFCF77"/>
                        </linearGradient>
                    </defs>
                </svg>`),
    $(`<svg preserveAspectRatio="none" class="book-decoration" width="100%" height="100%" viewBox="0 0 98 487" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="98" height="487" fill="url(#paint0_linear_336_592)" fill-opacity="0.2"/>
                    <defs>
                        <linearGradient id="paint0_linear_336_592" x1="98" y1="243.5" x2="0" y2="243.5" gradientUnits="userSpaceOnUse">
                            <stop/>
                            <stop offset="0.25" stop-opacity="0.407407"/>
                            <stop offset="0.75" stop-opacity="0"/>
                            <stop offset="0.985577" stop-opacity="0.25"/>
                        </linearGradient>
                    </defs>
                </svg>`)];
  let colorOptions = ['light-blue', 'light-green', 'red', 'yellow', 'purple', 'dark-green', 'dark-blue', 'maroon', 'orange'];
  let sizes = ['1', '2', '3', '4', '5', '6', '7'];

  // Helper to create a shuffled copy of an array
  const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);

  // Initialize our "decks"
  let colorDeck = shuffle(colorOptions);
  let sizeDeck = shuffle(sizes);

  let shuffledAnswers = shuffle(answer);
  // finds the ul with class book-container inside the quiz view and save to bookContainer variable
  let bookContainer = element.find('.book-container');
  // clear any previous books from the container before adding new ones
  bookContainer.empty();
  // loop through each call number in the shuffled answers array
  for (let i = 0; i < shuffledAnswers.length; i++) {
    // 1. Refresh decks if they run out of unique items
    if (colorDeck.length === 0) colorDeck = shuffle(colorOptions);
    if (sizeDeck.length === 0) sizeDeck = shuffle(sizes);

    // 2. "Pop" the last item off the shuffled deck to guarantee uniqueness
    let color = colorDeck.pop();
    let size = sizeDeck.pop();

    // 3. Create and style the element
    let bookElement = $(`<li class="book"><p>${shuffledAnswers[i]}</p></li>`);

    $(decoration[Math.floor(Math.random() * (decoration.length))]).clone().appendTo(bookElement);

    bookElement.addClass(`book-color-${color}`).addClass(`book-size-${size}`);
    bookContainer.append(bookElement);
  }
}

// 1. parse call number function, one parameter (call number string)
function parseCallNumber(callNumber) {

  let parts = {
    subjectLetter: "",
    subjectNumber: "",
    cutterLetters: [],
    cutterNumbers: [],
    year: "",
    volumeCopy: ""
  };

  let phase = "subject";
  let currentCutterLetter = "";
  let currentCutterNumbers = "";

  // iterating through call number one character at a time
  for (let i = 0; i < callNumber.length; i++) {
    if (phase === "subject") {
      // if the character is an uppercase letter
      if (callNumber.charAt(i).match(/[A-Z]/i)) {
        // add to subject letters we found so far
        parts.subjectLetter = parts.subjectLetter + callNumber.charAt(i);
        // this might be a cutter letter
      } else if (callNumber.charAt(i).match(/^\d+$/)) {
        parts.subjectNumber = parts.subjectNumber + callNumber.charAt(i);
      } else if (callNumber.charAt(i) === ".") {
        parts.subjectNumber = parts.subjectNumber + callNumber.charAt(i);
      } else {
        if (parts.subjectNumber !== "") {
          phase = "cutter";
        }
      }
    } else if (phase === "cutter") {
      if (callNumber.charAt(i).match(/[A-Z]/i)) {
        if (callNumber.charAt(i + 1) !== ".") {
          currentCutterLetter = currentCutterLetter + callNumber.charAt(i);
        } else {
          phase = "volumeCopy"
        }
      } else if (callNumber.charAt(i).match(/^\d+$/)) {
        if (currentCutterLetter !== "") {
          currentCutterNumbers = currentCutterNumbers + callNumber.charAt(i);
        } else {
          phase = "year"
          parts.year = parts.year + callNumber.charAt(i);
        }
      } else {
        if (currentCutterLetter !== "") {
          parts.cutterLetters.push(currentCutterLetter);
          currentCutterLetter = "";
        }
        if (currentCutterNumbers !== "") {
          parts.cutterNumbers.push(currentCutterNumbers);
          currentCutterNumbers = "";
        }
      }

    } else if (phase === "year") {
      if (callNumber.charAt(i).match(/^\d+$/)) {
        parts.year = parts.year + callNumber.charAt(i);
      } else {
        if (parts.year !== "") {
          phase = "volumeCopy";
        }
      }
    } else if (phase === "volumeCopy") {
      parts.volumeCopy += callNumber.charAt(i);
    }
  }

  if (phase === "cutter") {
    parts.cutterLetters.push(currentCutterLetter);
    parts.cutterNumbers.push(currentCutterNumbers);
  }

  return parts;
}

// shuffle subject letters for new call number
function shuffleCallNumber(parts, instructions) {
  const letterMatrix = getLetterMatrix();

  const shiftSubjectLetter = function (letters) {
    let row;
    let column;
    for (let i = 0; i < letterMatrix.length; i++) {
      if (letterMatrix[i].includes(letters)) {
        row = i;
        column = letterMatrix[i].indexOf(letters);
        break;
      }
    }
    return letterMatrix[row + instructions.subjectLetter2][column + instructions.subjectLetter1];
  }

  const shiftCutterLetter = function (letter) {
    let currentCode = letter.charCodeAt(0);
    return String.fromCharCode(currentCode + instructions.cutter);
  }

  const shiftWholeNumber = function (number) {
    return Number(number) + instructions.wholeNumber;
  }

  const shiftDecimal = function (number) {
    return Math.ceil(parseInt(number) / instructions.decimalNumber);
  }


  let newCallNumber = "";

  // 1. get subjectLetter/s and shift it
  newCallNumber += `${shiftSubjectLetter(parts.subjectLetter)} `;
  // 2. get subjectNumbers and shift it
  newCallNumber += `${shiftWholeNumber(parts.subjectNumber)} `;
  // 3. for each cutter
  // 3a. add a dot
  // 3b. shift cutter letter
  // 3c. shift cutter number
  for (let i = 0; i < parts.cutterLetters.length; i++) {
    if (i === 0) { newCallNumber += "."; }

    newCallNumber += shiftCutterLetter(parts.cutterLetters[i]);

    newCallNumber += `${shiftDecimal(parts.cutterNumbers[i])} `;
  }
  // 4. shift the year
  if (parts.year !== "") {
    newCallNumber += `${parseInt(parts.year) + instructions.year} `;
  } else {
    newCallNumber += "";
  }

  // 5. add the volume copy
  newCallNumber += parts.volumeCopy;

  newCallNumber = newCallNumber.replace(/\s+$/, '');

  return newCallNumber;
}

function shuffleLevel() {

  const myApp = getApp();
  const config = getConfig();

  // get all call numbers from the corresponding level listing
  const originalCallNumbers = config[myApp.pathway].practice[`level${myApp.level}`][myApp.gamePhase].answer;

  const wiggleSubjectLetter = function (letters) {
    const letterMatrix = getLetterMatrix();

    let row;
    let column;
    for (let i = 0; i < letterMatrix.length; i++) {
      if (letterMatrix[i].includes(letters)) {
        row = i;
        column = letterMatrix[i].indexOf(letters);
        break;
      }
    }


    return { left: column, right: letterMatrix[row].length - 1 - column, up: row, down: letterMatrix.length - 1 - row };
  }

  const wiggleCutterLetter = function (letter) {
    const currentCode = letter.charCodeAt(0);
    return { left: currentCode - 65, right: 90 - currentCode };
  }

  const wiggleYear = function (year) {
    const minYear = 1975;
    const maxYear = new Date().getFullYear();
    const cleanYear = parseInt(year);
    return { left: cleanYear - minYear, right: maxYear - cleanYear };
  }

  // parse through array of call numbers and pass to parse call number function

  let parsedCallNumbers = [];
  for (let i = 0; i < originalCallNumbers.length; i++) {
    parsedCallNumbers.push(parseCallNumber(originalCallNumbers[i]));
  }

  // store parts for each call number in a new array
  // loop through the array of parsed call numbers
  // check for wiggle room

  let subjectLeft = 100;
  let subjectRight = 100;
  let subjectUp = 100;
  let subjectDown = 100;

  let cutterLeft = 100;
  let cutterRight = 100;

  let yearLeft = 10000;
  let yearRight = 10000;

  for (let i = 0; i < parsedCallNumbers.length; i++) {
    const subjectBounds = wiggleSubjectLetter(parsedCallNumbers[i].subjectLetter);
    const cutterBounds = [];
    const yearBounds = parsedCallNumbers[i].year === "" ? null : wiggleYear(parsedCallNumbers[i].year);

    for (let j = 0; j < parsedCallNumbers[i].cutterLetters.length; j++) {
      cutterBounds.push(wiggleCutterLetter(parsedCallNumbers[i].cutterLetters[j]));
    }

    if (subjectBounds.left < subjectLeft) {
      subjectLeft = subjectBounds.left;
    }

    if (subjectBounds.right < subjectRight) {
      subjectRight = subjectBounds.right;
    }

    if (subjectBounds.up < subjectUp) {
      subjectUp = subjectBounds.up;
    }

    if (subjectBounds.down < subjectDown) {
      subjectDown = subjectBounds.down;
    }

    for (j = 0; j < cutterBounds.length; j++) {
      if (cutterBounds[j].left < cutterLeft) {
        cutterLeft = cutterBounds[j].left;
      }

      if (cutterBounds[j].right < cutterRight) {
        cutterRight = cutterBounds[j].right;
      }
    }

    if (yearBounds !== null) {
      if (yearBounds.left < yearLeft) {
        yearLeft = yearBounds.left;
      }

      if (yearBounds.right < yearRight) {
        yearRight = yearBounds.right;
      }
    }

  }

  const chooseDirection = function (left, right) {
    let movement = 0;
    if (left === 10000 || right === 10000) {
      return 0;
    }
    if (left > right) {
      movement = Math.floor(Math.random() * left) * -1;
    } else {
      movement = Math.floor(Math.random() * right);
    }
    return movement;
  }

  const instructions = {
    subjectLetter1: chooseDirection(subjectLeft, subjectRight),
    subjectLetter2: chooseDirection(subjectUp, subjectDown),
    wholeNumber: Math.floor(Math.random() * (17 - 1)) + 1,
    decimalNumber: Math.floor(Math.random() * (4 - 1)) + 1,
    cutter: chooseDirection(cutterLeft, cutterRight),
    year: chooseDirection(yearLeft, yearRight)
  };

  let shuffledCallNumbers = [];


  for (let i = 0; i < parsedCallNumbers.length; i++) {
    shuffledCallNumbers.push(shuffleCallNumber(parsedCallNumbers[i], instructions));
  }

  return shuffledCallNumbers;

  // determine appropriate shift parameter that works for all call numbers
  // loop through array and shift all call numbers and store shifted call numbers in a new array
  // return the array of shifted call numbers
}

// ============================================================
// SECTION 7: EVENT LISTENERS
// All click handlers in one place at the bottom.
// Ordered by user flow: title → onboarding → orientation → quiz → practice
// ============================================================


// drag and drop initialization 
$(function () {
  $("#list1, #list2").sortable({
    connectWith: "#list1, #list2",
    tolerance: "pointer"
  }).disableSelection();
});

$(function () {
  $(".book-container.module-quiz").sortable({ tolerance: "pointer" });
  $(".book-container.module-quiz").disableSelection(); // Optional: Prevents text selection while dragging
});

$("button").on("click", function () {
  // access app instance
  const myApp = getApp();
  // access the target attribute in the current view state
  const target = $(this).attr("target");
  // if the current view has a target attribute, call setView with the current target
  if (target !== undefined) {
    myApp.setView(target);
  }
  // if current view has nextQuestion attribute equal to true, then call loadQuiz()
  if (target === "view-quiz") {
    loadRead();
  }
  if (target === "view-onboarding") {
    myApp.pathway = $(this).attr("pathway");
    loadOnboarding();
  }
  if (target === "view-practice") {
    loadPractice();
  }
});

$(document).on("click", "#onboarding-next", function () {
  const myApp = getApp();
  const config = getConfig();

  // if there are more steps, load the next one
  if (myApp.onboardingStep < config[myApp.pathway].onboarding.length) {
    loadOnboarding();
  } else {
    // otherwise transition to orientation
    myApp.setView("view-orientation");
    myApp.onboardingStep = 0; // reset for if they ever come back
    loadOrientation();
  }
});

$(document).on("click", "#orientation-next", function () {
  const myApp = getApp();
  const config = getConfig();

  if (myApp.orientationStep < config[myApp.pathway].orientation.length) {
    loadOrientation();
  } else {
    myApp.setView("view-module-overview");
    loadModuleOverview();
    myApp.orientationStep = 0;
  }
});

$(document).on("click", "#read-next", function () {
  $("#quiz-section").fadeIn(200);
  $("#read-next").hide();
  loadQuiz();
});

// call checkQuizAnswers on submit button click
$(document).on("click", "#quiz-submit", function () {
  checkQuizAnswers();
});

// advance to next quiz question
$(document).on("click", "#quiz-next", function () {
  const myApp = getApp();
  const previousPart = myApp.part;
  const previousModule = myApp.module;

  myApp.hideModal();
  incrementQuiz(); // this might change myApp.part

  // if part changed after incrementing, load new read content
  if (myApp.part !== previousPart || myApp.module !== previousModule) {
    $("#quiz-section").hide();
    $("#read-next").show();
    loadRead();
  } else {
    loadQuiz();
  }

  $("#quiz-message").empty().append($('<button id="quiz-submit">Submit</button>'));
});

// reset submit button so user can try again and reshuffle books
$(document).on("click", "#quiz-try-again", function () {
  const myApp = getApp();
  myApp.hideModal();
  loadQuiz();
  $("#quiz-message").empty().append($('<button id="quiz-submit">Submit</button>'));
});

$(document).on("click", "#practice-submit", function () {
  checkPracticeAnswers();
});

$(document).on("click", "#practice-try-again", function () {
  const myApp = getApp();
  myApp.hideModal();
  loadPractice();
});

$(document).on("click", "#practice-next", function () {
  const myApp = getApp();
  myApp.hideModal();
  incrementPractice();
});


// ============================================================
// SECTION 8: DOCUMENT READY
// Entry point — kicks everything off.
// ============================================================

$(document).ready(function () {
  let myApp = getApp();
});

