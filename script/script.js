const input = document.body.querySelector(".input");
const taskItem = document.createElement("div")
const list = document.body.querySelector(".tasks-list")
const counterItem = document.body.querySelector(".status").querySelector("strong")
let completed = []

let counter = 0;

const refreshCounter = () => {
  counterItem.innerText = counter;
  console.log(counter.innerText)
}


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
    const completeBtn = taskItem.querySelector(".check-btn")
    const taskText = taskItem.querySelector(".task__text")

    completeBtn.addEventListener("click", () => {
      if (!completed.find(el => el === taskItem)) {
        completed.push(taskItem)
        taskText.style.textDecoration = "line-through"
        counter--
        refreshCounter()
        return
      }
      taskText.style.textDecoration = "none"
      completed = completed.filter((el) => el !== taskItem)
      counter++
      refreshCounter()

    })





    const deleteBtn = taskItem.querySelector(".task__btn-remove")
    deleteBtn.addEventListener("click", () => {
      taskItem.remove();
      counter--
      refreshCounter()
      if (completed.find(el => el === taskItem)) {
        completed = completed.filter((el) => el !== taskItem)
      }
    })

    list.appendChild(taskItem)
    counter++;
    input.value = ""
    refreshCounter()
  }
})



