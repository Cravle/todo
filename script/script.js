const ACTIVE = 'active';
const getElement = (selector) => document.body.querySelector(selector)

const input = getElement('.input')
const taskItem = document.createElement("div")
const list = document.body.querySelector(".tasks-list")// ul
const counterItem = document.body.querySelector(".status").querySelector("strong")// counter left from footer
const footer = document.body.querySelector("footer")
const completeAllBtn = document.querySelector("[data-all]")
//const list = [{name: 'test', status:ACTIVE }]


let allLists;

let completed = [] // arr for comleted li

let counter = 0;


const completeAll = ((listItems) => {
  if (!listItems.length) {
    return;
  }

  listItems.forEach(el => {
    const completeBtn = el.querySelector(".check-btn")
    const taskText = el.querySelector(".task__text")
    taskText.style.textDecoration = "line-through"
    completeBtn.style.color = "black"
    completed.push(el)
  })
  counter = 0

})

const uncompleteAll = ((listItems) => {
  listItems.length > 0 &&
    listItems.forEach(el => {
      const completeBtn = el.querySelector(".check-btn")
      const taskText = el.querySelector(".task__text")
      taskText.style.textDecoration = "none"
      completeBtn.style.color = "rgb(217, 217, 217)"

    })
  counter = listItems.length
  completed = []
})
//unccomplet all

//повесить ивент на нажатие toggleAll
completeAllBtn.addEventListener("click", () => {
  const listItems = document.querySelectorAll(".task")
  allLists = listItems
  //если counter === 0 uncompleteAll
  if (counter === 0) {
    uncompleteAll(listItems);
    refreshCounter();
    return
  }
  completeAll(listItems);
  refreshCounter();

})


const refreshCounter = () => {
  counterItem.innerText = counter;
  if (counter === 0 && completed.length === 0) {
    footer.style.display = "none"
  } else {
    footer.style.display = "grid"
  }
}
refreshCounter();


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


    //complete task
    completeBtn.addEventListener("click", () => {
      //if this item is not checked
      if (!completed.find(el => el === taskItem)) {
        completed.push(taskItem)
        taskText.style.textDecoration = "line-through"
        counter--
        completeBtn.style.color = "black"
        refreshCounter()
        return
      }
      taskText.style.textDecoration = "none"
      completeBtn.style.color = "rgb(217, 217, 217)"

      completed = completed.filter((el) => el !== taskItem)
      counter++
      refreshCounter()

    })





    const deleteBtn = taskItem.querySelector(".task__btn-remove")

    //delete task
    deleteBtn.addEventListener("click", () => {
      taskItem.remove();
      if (completed.find(el => el === taskItem)) {
        completed = completed.filter((el) => el !== taskItem)
        refreshCounter()

        return
      }
      counter--;
      refreshCounter()

    })

    list.appendChild(taskItem)
    counter++;
    input.value = ""
    refreshCounter()
  }
})


const ulMenu = document.querySelector(".menu")
const menuItems = document.querySelectorAll(".menu__item")

ulMenu.addEventListener("click", (e) => {
  if (e.target.className === "menu__item") {
    menuItems.forEach((item) => {
      item.classList.remove("active")
    })
    e.target.classList.add("active")
    if (e.target.getAttribute("data-sort") === "all") {

    }
    if (e.target.getAttribute("data-sort") === "active") {


    }
    if (e.target.getAttribute("data-sort") === "complited") {
      console.log("complited")
    }
  }
})



