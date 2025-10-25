async function loadData() {
  lists = await getList();
  console.log("this",lists);
  // process.exit(1);

  updateOnLeft();
}
async function deleteQuestionById(questionId) {
  if (!questionId) {
      console.error("Invalid ID:", questionId);
      return;
  }

  try {
      const response = await fetch(`http://localhost:2800/delThis/${questionId}`, {
          method: "DELETE",
      });

      const result =await response.json();
      console.log(result.message);

      return result;
  } catch (error) {
      console.error("Error deleting question:", error);
      alert("Failed to delete question. Please try again!");
  }
}

async function addResponse(questionId) {
  const resname = nameInput.value.trim();
  const rescomment = commentInput.value.trim();

  if (resname && rescomment) {
      try {
          const response = await fetch(`http://localhost:2800/addResponse/${questionId}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name: resname, comment: rescomment }),
          });

          const data = await response.json();
          console.log("Response added:", data);

          // Update UI
          appendNewResponse(data.response);
          nameInput.value = "";
          commentInput.value = "";
      } catch (error) {
          console.error("Error adding response:", error);
          alert("Failed to add response. Please try again.");
      }
  }
}



async function updateVotes(questionId, responseId, upVotes, downVotes) {
    if (voteTimer) {
        clearTimeout(voteTimer);
    }

    voteTimer = setTimeout(async () => {
        try {
            const response = await fetch(`http://localhost:2800/updateVote/${questionId}/${responseId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ upVotes, downVotes })
            });

            const data = await response.json();
            console.log("Vote updated successfully on server:", data);
        } catch (error) {
            console.error("Error updating votes on server:", error);
        }
    }, 1500);
}

async function toggleStar(questionId, favorite){
    try{
        const startoogle = await fetch(`http://localhost:2800/toggleFav/${questionId}`,{
            method: "PUT",
            headers: {
                "Content-Type" : "application/json"
            },
            body:JSON.stringify({favorite})
        });
    }catch(error){
        console.log("error on toggle star:", error);
    }
}



async function saveList(newData) {
    try {
      const response = await fetch("http://localhost:2800/addQuestion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });
  
      const data = await response.json();
      console.log(data);
  
      lists.push(data.question);
      console.log("THis" ,lists);
      appendNewQuestion(data.question);
  
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to save question. Please try again!");
    }
  }


async function getList() {
  try {
      const questionRes = await fetch("http://localhost:2800/getQuestions");

      return questionRes.json();
  } catch (error) {
      console.error("Error fetching data:", error);
      return []; 
  }
}