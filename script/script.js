const input = document.body.querySelector(".input");

const taskItem = document.createElement("div")
const list = document.body.querySelector(".tasks-list")



input.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    const taskItem = document.createElement("div")
    taskItem.innerHTML = `
        <li class="task wrapper">
          <button class="check">
            <div class="check-btn ">✔</div>
          </button>
          <div class="task__wrapper">
            <div class="task__text light-black">
              ${input.value}
          </div>
        </div>
        <button class="task__btn-remove">X</button>
      </li>
        `




    const deleteBtn = taskItem.querySelector(".task__btn-remove")
    deleteBtn.addEventListener("click", () => {
      taskItem.remove();
    })

    list.appendChild(taskItem)
    input.value = ""

  }
})

