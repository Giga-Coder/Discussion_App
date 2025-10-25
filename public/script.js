let showOnlyFavorites = false;
let voteTimer = null;
const questionForm = document.querySelector(".question-form");
const subjectField = document.getElementById("subject");
const questionField = document.getElementById("question");
const questionSection = document.querySelector(".question-section");

// BUTTONS
const newBtn = document.getElementById("new-btn");
const resolveBtn = document.getElementById("resolve-btn");
const starBtn = document.getElementById("star-btn");
const mainStarBtn = document.getElementById("main-star");


const defaultContent = document.querySelector(".default-content");
const questionBox = document.querySelector(".question-box");
const boxSubject = document.getElementById("box-subject");
const boxQuestion = document.getElementById("box-question");

// response section 
const responseSection = document.querySelector(".response-section");
const responseForm = document.querySelector(".response-form");
const nameInput = document.getElementById("name");
const commentInput = document.getElementById("comment");
const responsesList = document.querySelector(".responses-list");

const searchBar = document.querySelector(".search");
console.log("Restart....");
let lists = [];


loadData();

function sortResponses(responses) {
    return responses.sort((a, b) => (b.upVotes - b.downVotes) - (a.upVotes - a.downVotes));
}


function timeAgo(timestamp) {
    const now = Date.now();
    
    const seconds = Math.floor((now - timestamp) / 1000);
    if (seconds < 60) {
        return `${seconds}s ago`; 
    }
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
        return `${minutes}m ago`; 
    }
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
        return `${hours}h ago`; 
    }
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}


setInterval(() => {
    const timeElements = document.querySelectorAll(".created-time");
    timeElements.forEach(curr => {
        const timestamp = parseInt(curr.dataset.timestamp, 10); // Get the timestamp
        curr.textContent = timeAgo(timestamp); 
    });
}, 1000); 



// Get the search input field
searchBar.addEventListener("input", function () {
    let searchTerm = this.value.trim();
    let question = document.querySelectorAll(".question");


    question.forEach(q => {
        h2 = q.querySelector("h2");

        h2.innerHTML = h2.textContent; 

        let text = h2.textContent;

        if (searchTerm === ""){
            q.style.display = "block";
            return;
        } 
        let regex = new RegExp(`(${searchTerm})`, "gi");
        if (regex.test(text)) {
            h2.innerHTML = text.replace(regex, '<span class="highlight">$1</span>');
            q.style.display = "block";
        } else {
            q.style.display = "none";
        }
    });

});


  

// 3. adding question
function addQuestion() {
    const subject = subjectField.value.trim();
    const question = questionField.value.trim();

    if (!subject || !question) {
        alert("Please fill both fields!");
        return;
    }

    const newData = { subject, question };


    saveList(newData); // Pass new data to saveList()

    subjectField.value = "";
    questionField.value = "";
}


// add html 
function updateOnLeft() {
    console.log("here is here");
    questionSection.innerHTML = ""; 

    lists.forEach(appendNewQuestion);
}

function appendNewQuestion(item) {
    const questionDiv = document.createElement("div");
    questionDiv.classList.add("question");
    questionDiv.dataset.id = item.id;

    const starColor = item.favorite ? "yellow" : "gray";

    questionDiv.innerHTML = `
        <button class="star-btn" data-item-id="${item.id}" title="star">
        <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="${starColor}"><path d="M480-644v236l96 74-36-122 90-64H518l-38-124ZM233-120l93-304L80-600h304l96-320 96 320h304L634-424l93 304-247-188-247 188Z"/></svg>
        </button>
        <h2>${item.subject}</h2>
        <hr>
        <p>${item.question}</p>
        <small>Created: <span class="created-time" data-timestamp="${item.createdDate}">${timeAgo(item.createdDate)}</span></small>

    `;

    questionSection.appendChild(questionDiv);
}



function appendNewResponse(response) {
    const responseDiv = document.createElement("div");
    responseDiv.classList.add("userRes");
    responseDiv.dataset.resId = response.id; // Assign the response ID

    responseDiv.innerHTML = `
        <button class="delete-btn" data-res-id="${response.id}" title="Delete">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#0d1b2a">
                <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
            </svg>
        </button>
        <h3>${response.name}</h3>
        <p>${response.comment}</p>
        <h6>${response.createdDate}</h6>
        <button class="upVote" data-res-id="${response.id}">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#0d1b2a">
                <path d="M720-120H280v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h258q32 0 56 24t24 56v80q0 7-2 15t-4 15L794-168q-9 20-30 34t-44 14Zm-360-80h360l120-280v-80H480l54-220-174 174v406Zm0-406v406-406Zm-80-34v80H160v360h120v80H80v-520h200Z"/>
            </svg>
            <span>${response.upVotes}</span>
        </button>
        <button class="downVote" data-res-id="${response.id}">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#0d1b2a">
                <path d="M240-840h440v520L400-40l-50-50q-7-7-11.5-19t-4.5-23v-14l44-174H120q-32 0-56-24t-24-56v-80q0-7 2-15t4-15l120-282q9-20 30-34t44-14Zm360 80H240L120-480v80h360l-54 220 174-174v-406Zm0 406v-406 406Zm80 34v-80h120v-360H680v-80h200v520H680Z"/>
            </svg>
            <span>${response.downVotes}</span>
        </button>
    `;

    responsesList.appendChild(responseDiv);

}

function renderResponses(question, newResponse = null) {
        
        responsesList.innerHTML = "";
        question.responses = sortResponses(question.responses);

        
        question.responses.forEach(appendNewResponse);

    // Add event listeners for delete buttons
    document.querySelectorAll(".delete-btn").forEach(button => {
        button.addEventListener("click", function () {
            const resId = Number(this.dataset.resId);
            question.responses = question.responses.filter(res => res.id !== resId);
            // saveList(); 
            renderResponses(question); 
        });
    });
}


// Function to display the selected question on the right pane
function displayOnRight(item) {
    defaultContent.style.display = "none";
    questionBox.style.display = "block";
    responseSection.style.display = "block";

    boxSubject.textContent = item.subject;
    boxQuestion.textContent = item.question;
    boxSubject.dataset.id = item.id;
    renderResponses(item);

    // console.log(" ID:", boxSubject.dataset.id);
}
// finding right pos
function findInsertPosition(responses, response) {
    let left = 0, right = responses.length - 1;
    let scoreNew = response.upVotes - response.downVotes;

    while (left <= right) {
        let mid = Math.floor((left + right) / 2);
        let scoreMid = responses[mid].upVotes - responses[mid].downVotes;

        if (scoreNew > scoreMid) {
            right = mid - 1;
        } else {
            left = mid + 1;
        }
    }
    return left; // New position for insertion
}

// event listeners


// 2. Event occour : for adding questions 
questionForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addQuestion();

})
// adding responses
responseForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const currId = Number(boxSubject.dataset.id);
    addResponse(currId);
});


// adding quesiton 
newBtn.addEventListener("click",(event) =>{
    defaultContent.style.display = "block";
    questionBox.style.display = "none";
    responseSection.style.display = "none";

})

// STAR BUTTON & Question Block
questionSection.addEventListener("click", (event) => {
    const starButton = event.target.closest(".star-btn");
    if (starButton) {
        const itemId = starButton.dataset.itemId;

        const item = lists.find(item => item.id == itemId);
        if (item) {
            item.favorite = !item.favorite;


            const starIcon = starButton.querySelector("svg");
            starIcon.setAttribute("fill", item.favorite ? "yellow" : "gray");
            // console.log(item.favorite, itemId);
            toggleStar(itemId, item.favorite);

            // saveList();
            return;
        }
    }
    const clickedElement = event.target.closest(".question");
    if(clickedElement) {
        const questionId = clickedElement.dataset.id;
        const currQuestion = lists.find(item => item.id == questionId);
        if (currQuestion) {
            displayOnRight(currQuestion);
        }
    }
});

// delete a question
resolveBtn.addEventListener("click", async function (event) {
    event.preventDefault();
    const currId = Number(boxSubject.dataset.id);

    if (!currId) return;


    // Remove from local array
    const itemIndex = lists.findIndex(item => item.id === currId);
    if (itemIndex !== -1) {
        lists.splice(itemIndex, 1);
    }

    // Remove from UI
    const questionDiv = document.querySelector(`.question[data-id='${currId}']`);
    if (questionDiv) {
        questionDiv.remove();
    }

    // Show default content after deletion
    defaultContent.style.display = "block";
    questionBox.style.display = "none";
    responseSection.style.display = "none";
    deleteQuestionById(currId);

});





responsesList.addEventListener("click", function (event) {
    const upVoteBtn = event.target.closest(".upVote");
    const downVoteBtn = event.target.closest(".downVote");

    if (upVoteBtn || downVoteBtn) {
        const resId = Number((upVoteBtn || downVoteBtn).dataset.resId);
        const currId = Number(boxSubject.dataset.id);
        const question = lists.find(item => item.id === currId);

        if (question) {
            // Find the response object
            const responseIndex = question.responses.findIndex(resp => resp.id === resId);
            if (responseIndex !== -1) {
                let response = question.responses[responseIndex];  // saving 

                if (upVoteBtn) response.upVotes += 1;
                if (downVoteBtn) response.downVotes += 1;

                

                // saveList(); 

                // Find the response element in the DOM
                const responseElement = responsesList.querySelector(`[data-res-id='${resId}']`);
                // console.log(responseElement);
                if (responseElement) {
                    responseElement.querySelector('.upVote span').textContent = response.upVotes;
                    responseElement.querySelector('.downVote span').textContent = response.downVotes;
                }

                // Remove and reinsert 
                question.responses.splice(responseIndex, 1);
                let newPos = findInsertPosition(question.responses, response);
                question.responses.splice(newPos, 0, response);

                // Move 
                responsesList.removeChild(responseElement);
                if (newPos === 0) {
                    responsesList.prepend(responseElement); // Move to top if needed
                } else {
                    const nextElement = responsesList.children[newPos];
                    console.log(nextElement);
                    responsesList.insertBefore(responseElement, nextElement);
                }
                // Api call

                updateVotes(currId, resId, response.upVotes, response.downVotes);
            }
        }
    }
});

// only showing the favorite questions  

mainStarBtn.addEventListener("click", () => {
    showOnlyFavorites = !showOnlyFavorites; 

    mainStarBtn.querySelector("svg").setAttribute("fill", showOnlyFavorites ? "yellow" : "gray");

    
    const questions = document.querySelectorAll(".question");

    questions.forEach((question) => {
        const itemId = question.dataset.id; 
        const item = lists.find(item => item.id == itemId); 

        if (item) {
            
            if (showOnlyFavorites && !item.favorite) {
                question.style.display = "none"; 
            } else {
                question.style.display = "block"; 
            }
        }
    });
});

