const ACTIVE = 'active'
const COMPLITED = 'complited'
const EDIT = 'edit'

const getElement = (selector) => document.body.querySelector(selector)

const input = getElement('.input')
const taskItem = document.createElement("div")
const list = document.body.querySelector(".tasks-list")// ul
const counterItem = document.body.querySelector(".status").querySelector("strong")// counter left from footer
const footer = document.body.querySelector("footer")
const completeAllBtn = document.querySelector("[data-all]")
//const list = [{name: 'test', status:ACTIVE }]

let listArr = [];

let counter = 0;


const toggleStatusTasks = () => {
  let flag = false;
  for (let i = 0; i < listArr.length; i++) {
    if (listArr[i].status === ACTIVE) {
      flag = true
      break
    }
  }


  if (flag) {
    listArr = listArr.map(el => {
      el.status = COMPLITED
      return el
    })

  } else {
    listArr = listArr.map(el => {
      el.status = ACTIVE
      return el
    })
  }
  generateList()



}


const generateList = () => {
  list.innerHTML = ""
  const newList = listArr.map(el => {
    const taskItem = document.createElement("div")
    if (el.status === COMPLITED) {
      taskItem.innerHTML = `
        <li class="task wrapper">
          <button class="check checked">✔</button>
          <div class="task__wrapper">
            <div class="task__text complited light-black ">
              ${el.text}
          </div>
        </div>
        <button class="task__btn-remove">X</button>
      </li>
        `
      return taskItem
    }
    taskItem.innerHTML = `
        <li class="task wrapper">
          <button class="check">✔</button>
          <div class="task__wrapper">
            <div class="task__text light-black ">
              ${el.text}
          </div>
        </div>
        <button class="task__btn-remove">X</button>
      </li>
        `
    return taskItem;
  })

  let localCounter = 0;
  listArr.forEach((el) =>
    el.status === ACTIVE && localCounter++
  )

  counter = localCounter
  refreshCounter()

  newList.forEach(el => list.appendChild(el))
}


list.addEventListener("click", (e) => {
  if (e.target.classList.contains("check")) {
    const text = e.target.parentElement.querySelector('.task__text').innerText
    listArr = listArr.map(el => {
      if (el.text === text) {
        el.status === ACTIVE ? el.status = COMPLITED : el.status = ACTIVE
      }
      return el
    })
    generateList()
  }

  if (e.target.className === "task__btn-remove") {
    const text = e.target.parentElement.querySelector('.task__text').innerText

    listArr = listArr.filter(el => el.text !== text && el)
    generateList()

  }

})


const refreshCounter = () => {
  counterItem.innerText = counter;
  if (counter === 0 && listArr.length === 0) {
    footer.style.display = "none"
  } else {
    footer.style.display = "grid"
  }
}
refreshCounter();

//submit input
input.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    if (input.value.trim().length) {
      let text = input.value;




      listArr.forEach((el, id) => {
        if (el.text === text)
          text = input.value + `[${id + 1}]`
      })

      listArr.push({ text, status: ACTIVE })
      generateList()
      input.value = ""

      refreshCounter()
    }
  }
})


completeAllBtn.addEventListener('click', toggleStatusTasks)




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
    }
  }
})






