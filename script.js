

class App {
    constructor(element) {
        this.element = element;
        this.module = 1;
        this.part = 1;
        this.question = 1;
        this.onboardingStep = 0;
        this.orientationStep = 0;
    }

    // sets a view and hides all others
    setView(className) {
        // copies parameter className into local variable targetClass
        let targetClass = className;
        // declares matchingView variable
        let matchingView;
        /* loops over each div that is a direct child 
        of #app (body) whose class attribute 
        starts with "view-" */
        this.element.children('[class^="view-"]').each(function () {
            /* if the element's class matches the class passed into the function,
             save the element to matchingView variable*/
            if ($(this).hasClass(targetClass)) {
                matchingView = $(this);
            }
            // checks if current element is already hidden 
            if ($(this).css('display') === 'none') {
            } else {
                /* if the element is visible, fade it out 200 ms and hide all views*/
                $(this).fadeOut(200);
            }
        });
        // after the loop, fade in the target view (200 ms)
        matchingView.fadeIn(200);
    }
}

function checkQuizAnswers() {
    // access config 
    const config = getConfig();
    // access app instance
    const myApp = getApp();
    // access answer key for current view state in the config and save to answerKey array variable
    const answerKey = config.quiz[`module${myApp.module}`][`part${myApp.part}`][`question${myApp.question}`].answer;
    // convert user's book list to an array
    const userAnswers = $('.view-quiz').find($('.book')).toArray();
    // set correct variable to 0
    let correct = 0;

    // loop through the answerKey array
    for (let i = 0; i < answerKey.length; i++) {
        // console.log(answerKey[i]);
        // console.log($(userAnswers[i]).find('p').text());
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
        const feedback = config.quiz[`module${myApp.module}`][`part${myApp.part}`][`question${myApp.question}`].feedback;
        element = $(`<p id="quiz-feedback">${feedback}</p><button id="quiz-next">Next</button>`);
        /* otherwise, if correct counter is not equal to the answerKey length,
        then user gets a try again button  */
    } else {
        element = $('<p></p><button id="quiz-try-again">Try Again</button>');
    }
    // clears the submit button
    $("#quiz-message").empty();
    // adds the element (either a next + feedback or try again)
    $("#quiz-message").append(element);
}


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
    if (Object.keys(config.quiz[`module${myApp.module}`][`part${myApp.part}`]).length - 1 > currentQuestion) {
        // move to the next question in the same part if 3 is greater than currentQuestion
        myApp.question++;
    } else {
        /* if currentQuestion is 3, grab the part keys in the module 
        and put them in an array of length 2 (there are 2 parts in the module) 
        check if 2 is greater than the currentPart number (starts at 1)*/
        if (Object.keys(config.quiz[`module${myApp.module}`]).length > currentPart) {
            // if on question 3 of part 1, then set question to 1 and increment part to 2
            myApp.question = 1;
            myApp.part++;
        } else {
            /* if  currentQuestion is 3 and part is 2, grab the module keys in the config
            and put them in an array of length 3 (there are 3 modules).
            check if 3 is greater than currentModule number (starts at 1)*/
            if (Object.keys(config.quiz).length > currentModule) {
                // set question to 1, part to 1, and increment module by 1 
                myApp.question = 1;
                myApp.part = 1;
                myApp.module++;
            } else {
                // if none of these conditions are met (on the final question in the final part of the final module), return false
                return false;
            }
        }
        // if one of the conditions are met, return true
    } return true;
}


function loadOnboarding() {
    const myApp = getApp();
    const config = getConfig();

    // display current step text
    $("#onboarding-text").text(config.onboarding[myApp.onboardingStep]);

    // increment step for next click
    myApp.onboardingStep++;
}

function loadOrientation() {
    const myApp = getApp();
    const config = getConfig();

    $("#orientation-text").text(config.orientation[myApp.orientationStep]);

    myApp.orientationStep++;
}

function loadRead() {
    const myApp = getApp();
    const config = getConfig();

    const readContent = config.quiz[`module${myApp.module}`][`part${myApp.part}`].read;
    if (myApp.part === 2) {
        $("#progress-bar").attr("progress", 4);
    }

    $("#read-eyebrow").text(`Module ${myApp.module}`);
    $("#read-heading").text(readContent.heading);
    $("#read-content").html(readContent.content);
}

// reads the current question from config and populates the quiz view
function loadPractice() {
    // access config 
    const config = getConfig();
    // select the view-quiz div and saves to viewElement variable
    const viewElement = $('.view-quiz');
    // access app instance
    const myApp = getApp();
    // sets h2 to the text found in heading key in config for the current view state in app instance 
    viewElement.find('.quiz-heading').text(config.quiz[`module${myApp.module}`][`part${myApp.part}`][`question${myApp.question}`].heading);
    // sets p to the text found in text key in config for the current view state in app instance
    viewElement.find('.quiz-body').text(config.quiz[`module${myApp.module}`][`part${myApp.part}`][`question${myApp.question}`].text);
    // calls createBooks by passing in viewElement and the answer key content in config for the current view state in app instance
    createBooks(viewElement, config.quiz[`module${myApp.module}`][`part${myApp.part}`][`question${myApp.question}`].answer);

    $("#progress-bar").attr("progress", myApp.part * 3 - 3 + myApp.question);
    console.log(config.quiz[`module${myApp.module}`][`part${myApp.part}`][`question${myApp.question}`]);
}


$("button").on("click", function () {
    // access app instance
    const myApp = getApp();
    // access the target attribute in the current view state
    const target = $(this).attr("target");
    // if the current view has a target attribute, call setView with the current target 
    if (target !== undefined) {
        myApp.setView(target);
    }
    // if current view has nextQuestion attribute equal to true, then call loadPractice()
    if (target === "view-quiz") {
        loadRead();
    }
    if (target === "view-onboarding") {
        loadOnboarding();
    }

});

$(document).on("click", "#onboarding-next", function () {
    const myApp = getApp();
    const config = getConfig();

    // if there are more steps, load the next one
    if (myApp.onboardingStep < config.onboarding.length) {
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

    if (myApp.orientationStep < config.orientation.length) {
        loadOrientation();
    } else {
        myApp.setView("view-module-overview");
        myApp.orientationStep = 0;
    }
});

$(document).on("click", "#read-next", function () {
    $("#quiz-section").fadeIn(200);
    $("#read-next").hide();
    loadPractice();
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

    incrementQuiz(); // this might change myApp.part

    // if part changed after incrementing, load new read content
    if (myApp.part !== previousPart || myApp.module !== previousModule) {
        $("#quiz-section").hide();
        $("#read-next").show();
        loadRead();
    } else {
        loadPractice();
    }

    $("#quiz-message").empty();
    $("#quiz-message").append($('<button id="quiz-submit">Submit</button>'));
});

// reset submit button so user can try again and reshuffle books
$(document).on("click", "#quiz-try-again", function () {
    loadPractice();
    $("#quiz-message").empty();
    $("#quiz-message").append($('<button id="quiz-submit">Submit</button'));
});

// self executes this function immediately
const appState = (function () {
    // create app instance for the whole application - one and done!
    const app = new App($('#app'));
    // content data for the app 
    const config = {
        onboarding: [
            "Congratulations on being accepted into the Library Delivery Service training program! Once your training is complete, you will be a certified Delivery Specialist ready for deployment!",
            "Books don’t sit just anywhere. Every item in a collection has a precise location on the shelf - its home, waiting to be found. Your job is to get them there.",
            "Every book’s home address is encoded in its call number: a string of letters and numbers that map to its exact location on the shelf. ",
            "Once you know how to read a call number, you can deliver the book to its home.",
            "Here’s how training works:",
            "You’ll learn to read a call number one section at a time, starting broad and gradually getting more specific. At each stage, you’ll practice call number ordering before moving on.",
            "Remember, call number ordering is the key to delivering a book to its correct location. ",
            "Complete the training program, and you’ll be ready to take your first job assignment. "
        ],
        orientation: [
            "A call number is the unique address of a book on the shelf. Every item in the collection has one and no two items share the same address.",
            "Call numbers consist of letters, whole numbers, decimals, often a publication date, and occasionally a volume and/or copy number.",
            "The entire call number should be read as one line in a database.", // image will go here later
            "However, a call number on the physical item will be printed on the spine label and read from top to bottom.", // image goes here later
            "Every call number has two main parts, divided by a decimal point. Subject — everything before the decimal (identifies the broad topic area). Cutter — everything after the decimal (identifies the specific item).",
            "The more components a call number has, the more specific its address. Some call numbers include additional cutters, a publication year, a volume number, and/or a copy number.",
            "Before you start training, there is one governing rule to know because it applies at every stage.",
            "A shorter call number always comes before a longer one when all preceding elements match. This is called the 'Nothing before Something' rule."
        ],
        quiz: {
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
                        answer: ['B', 'H', 'L', 'P'],
                        feedback: "Subject letters sort alphabetically."
                    },
                    question2: {
                        heading: "Level 2: Single & double letters",
                        text: "Sort subject letters",
                        answer: ['B', 'L', 'LA', 'LB'],
                        feedback: "A single letter always comes before a double letter that starts with the same letter. L comes before LA and LB."
                    },

                    question3: {
                        heading: "Level 3: Single & double letters, larger range",
                        text: "Sort subject letters",
                        answer: ['G', 'M', 'P', 'PA', 'PB'],
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
                        answer: ['GV 706 .R423 A12', 'GV 706 .R423 M34', 'GV 706 .R423 S55'],
                        feedback: "The additional cutter sorts alphabetically by letter, just like the main cutter."
                    },
                    question2: {
                        heading: "Same additional cutter letter, decimal fraction differences",
                        text: "Sort subject letters + subject numbers + cutter number + additional cutter",
                        answer: ['BF 408 .R423 H127', 'BF 408 .R423 H3', 'BF 408 .R423 H52'],
                        feedback: "The numbers in an additional cutter are decimal fractions, just like the main cutter. H127 = 0.127,  H3 = 0.30,  H52 = 0.52"
                    },
                    question3: {
                        heading: "With and without additional cutter mixed",
                        text: "Sort subject letters + subject numbers + cutter number + additional cutter",
                        answer: ['DS 135 .S55', 'DS 135 .S55 A12', 'DS 135 .S55 H3', 'DS 135 .S55 H52'],
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
                            <li>Sorted chronologically: earlier year first.</li>
                            <li><strong>1978 &lt; 2007</strong></li>
                         </ul>`
                    },
                    question1: {
                        heading: "Same base, different years",
                        text: "Sort subject letters + subject numbers + cutter number + additional cutter + publication year",
                        answer: ['LA 212 .R423', 'LA 212 .R423 2005', 'LA 212 .R423 2010'],
                        feedback: "A call number with no year shelves before its dated edition. Dated editions sort chronologically. "
                    },
                    question2: {
                        heading: "Mixed shelf, some with years",
                        text: "Sort subject letters + subject numbers + cutter number + additional cutter + publication year",
                        answer: ['BF 408 .C55', 'BF 408 .C55 2014', 'BF 408 .H3 2009', 'BF 408 .S22'],
                        feedback: "Sort by cutter first. When two items share the same cutter, the one without a year shelves first. Notice that .H3 has a year but still shelves before .S22, which has none. A year only affects placement when two items share the same cutter."
                    },
                    question3: {
                        heading: "PLACEHOLDER",
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
                        heading: "PLACEHOLDER",
                        text: "Sort subject letters + subject numbers + cutter number + additional cutter + publication year",
                        answer: ['PLACEHOLDER'],
                        feedback: "PLACEHOLDER"
                    },
                    question2: {
                        heading: "PLACEHOLDER",
                        text: "Sort subject letters + subject numbers + cutter number + additional cutter + publication year",
                        answer: ['PLACEHOLDER'],
                        feedback: "PLACEHOLDER"
                    },
                    question3: {
                        heading: "PLACEHOLDER",
                        text: "Sort subject letters + subject numbers + cutter number + additional cutter + publication year",
                        answer: ['PLACEHOLDER'],
                        feedback: "PLACEHOLDER"
                    }
                }
            },

            practice: {
                level1: {
                    cartSort: {
                        heading: "Task 1: Cart Sort",
                        text: "Arrange books on the cart and click submit when done to check work. ",
                        answer: ["HD58.9 .I473 1994", "HD59 .H64 1994", "HD59 .S365 2012", "HD59.5 .H42 1997", "HD60 .I77 1996", "HD60.5 .U5 .P6", "HD62.15 .A57 1995", "HD62.15 .M47 1997", "HF32 .A53", "HF32 .B2"]
                    },
                    shelfSort: {
                        heading: "Task 2: Shelf Sort",
                        text: "placeholder",
                        answer: ['PLACEHOLDER']
                    },
                    QA: {
                        heading: "Task 3: Quality Assurance",
                        text: "placeholder",
                        answer: ['PLACEHOLDER']
                    }
                },
            }
        }
    };

    // enables access app instance from anywhere in the script
    window.getApp = function () {
        return app;
    }

    // enables access to config from anywhere in the script 
    window.getConfig = function () {
        return config;
    }

})();

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

// shuffle subject letters for new call number
function shuffleCallNumber(callNumber, down = -1, right = 1, right2 = 5, add1 = 7, divide1 = 2, yearShift = 5) {
    const letterMatrix = [
        ['B', 'BD', 'BH', 'BL', 'BR', 'BS'],
        ['C', 'CB', 'CE', 'CR', 'CS', 'CT'],
        ['G', 'GA', 'GE', 'GF', 'GR', 'GV'],
        ['H', 'HA', 'HD', 'HF', 'HQ', 'HV'],
        ['L', 'LB', 'LF', 'LH', 'LJ', 'LT']
    ];

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
        return letterMatrix[row + down][column + right];
    }

    const shiftCutterLetter = function (letter) {
        let currentCode = letter.charCodeAt(0);
        return String.fromCharCode(currentCode + right2);
    }

    const shiftWholeNumber = function (number) {
        return parseInt(number) + add1;
    }

    const shiftDecimal = function (number) {
        return Math.floor(parseInt(number) / divide1);
    }

    let subjectLetter = "";
    let subjectNumber = "";
    let currentCutterLetter = "";
    let currentCutterNumbers = "";
    let cutterLetters = [];
    let cutterNumbers = [];
    let phase = "subject";
    let year = "";
    let volumeCopy = "";


    // iterating through call number one character at a time
    for (let i = 0; i < callNumber.length; i++) {
        if (phase === "subject") {
            // if the character is an uppercase letter
            if (callNumber.charAt(i).match(/[A-Z]/i)) {
                // add to subject letters we found so far
                subjectLetter = subjectLetter + callNumber.charAt(i);
                // this might be a cutter letter
            } else if (callNumber.charAt(i).match(/^\d+$/)) {
                subjectNumber = subjectNumber + callNumber.charAt(i);
            } else if (callNumber.charAt(i) === ".") {
                subjectNumber = subjectNumber + callNumber.charAt(i);
            } else {
                if (subjectNumber !== "") {
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
                    year = year + callNumber.charAt(i);
                }
            } else {
                if (currentCutterLetter !== "") {
                    cutterLetters.push(currentCutterLetter);
                    currentCutterLetter = "";
                }
                if (currentCutterNumbers !== "") {
                    cutterNumbers.push(currentCutterNumbers);
                    currentCutterNumbers = "";
                }
            }

        } else if (phase === "year") {
            if (callNumber.charAt(i).match(/^\d+$/)) {
                year = year + callNumber.charAt(i);
            } else {
                if (year !== "") {
                    phase = "volumeCopy";
                }
            }
        } else if (phase === "volumeCopy") {
            volumeCopy += callNumber.charAt(i);
        }
    }


    let newCallNumber = "";

    console.log(subjectLetter);
    // 1. get subjectLetter/s and shift it
    newCallNumber += `${shiftSubjectLetter(subjectLetter)} `;
    // 2. get subjectNumbers and shift it
    newCallNumber += `${shiftWholeNumber(subjectNumber)} `;
    // 3. for each cutter
    // 3a. add a dot 
    // 3b. shift cutter letter 
    // 3c. shift cutter number 
    for (let i = 0; i < cutterLetters.length; i++) {
        if (i === 0) { newCallNumber += "."; }

        newCallNumber += shiftCutterLetter(cutterLetters[i]);

        newCallNumber += `${shiftDecimal(cutterNumbers[i])} `;
    }
    // 4. shift the year
    newCallNumber += `${parseInt(year) + yearShift} `;
    // 5. add the volume copy 

    newCallNumber += volumeCopy;

    newCallNumber = newCallNumber.replace(/\s+$/, '');

    return newCallNumber;

}

$(document).ready(function () {
    let myApp = getApp();
    myApp.setView('view-module-overview');
    console.log(shuffleCallNumber("HD 58.9 .I473 1994"));
    console.log(shuffleCallNumber("HF 1418.5 .R6425 2011"));
    console.log(shuffleCallNumber("C 17.63 .R64 L12 2000 v.1"));
});
