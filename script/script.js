// CONSTANTS
const ACTIVE = 'active'
const COMPLITED = 'complited'
const EDIT = 'edit'

// UTILS
const getElement = selector => document.querySelector(selector)
const isActive = task => task.status === ACTIVE
const isCompleted = task => task.status === COMPLITED
const generateId = () => Date.now()

// VARIABLES
const input = getElement('.input')
const taskItem = getElement('div')
const list = getElement('.tasks-list') // ul
const counterItem = getElement('.status').querySelector('strong')
const footer = getElement('footer')
const completeAllBtn = getElement('[data-all]')
const ulMenu = document.querySelector('.menu')
const menuItems = document.querySelectorAll('.menu__item')

let taskList = []

const toggleStatusTasks = () => {
	const isSomeCompleted = taskList.some(isActive)
	taskList = taskList.map(task => ({ ...task, status: isSomeCompleted ? COMPLITED : ACTIVE }))

	checkTasksStatus()
	renderList()
}

const checkTasksStatus = () => {
	console.log(taskList.every(isCompleted), 'taskList.every(isCompleted)')
	console.log(taskList, 'taskList')
	taskList.every(isCompleted) ? completeAllBtn.classList.add('active') : completeAllBtn.classList.remove('active')
}

const renderList = () => {
	list.innerHTML = ''
	const names = []
	const newList = taskList.map(task => {
		const counter = names.reduce((acc, name) => (name === task.name ? acc + 1 : acc), 0) // rename
		names.push(task.name)

		task.text = counter ? `${task.name}[${counter}]` : task.name
		const taskItem = document.createElement('div')
		if (task.status === COMPLITED) {
			taskItem.innerHTML = `
        <li class="task wrapper" data-id="${task.id}">
          <button class="check checked">✔</button>
          <div class="task__wrapper">
            <div class="task__text complited light-black ">
              ${task.text}
          </div>
        </div>
        <button class="task__btn-remove">X</button>
      </li>
        `
			return taskItem
		}
		taskItem.innerHTML = `
        <li class="task wrapper" data-id="${task.id}">
          <button class="check">✔</button>
          <div class="task__wrapper">
            <div class="task__text light-black " >
              ${task.text}
          </div>
        </div>
        <button class="task__btn-remove">X</button>
      </li>
        `
		return taskItem
	})

	refreshCounter()

	newList.forEach(el => list.appendChild(el))
}

const refreshCounter = () => {
	const counter = taskList.reduce((acc, { status }) => (status === ACTIVE ? acc + 1 : acc), 0)
	counterItem.innerText = counter
	taskList.length ? footer.classList.remove('display-none') : footer.classList.add('display-none')
}

const onListClick = ({ target }) => {
	const id = Number(target.parentElement.dataset.id)
	const isDelited = target.classList.contains('task__btn-remove')
	const isChecked = target.classList.contains('check')
	if (isChecked) {
		const task = taskList.find(task => task.id === id)
		task.status = task.status === COMPLITED ? ACTIVE : COMPLITED
	}

	if (isDelited) {
		taskList = taskList.filter(task => task.id !== id)
	}
	renderList()
	checkTasksStatus()
}

const onSubmut = ({ key }) => {
	const text = input.value

	if (key !== 'Enter' || !text.trim().length) {
		return
	}

	const id = generateId()
	taskList.push({ text, name: text, status: ACTIVE, id })
	input.value = ''

	checkTasksStatus()
	renderList()
	refreshCounter()
}

const onSortMenuClick = ({ target }) => {
	if (target.className !== 'menu__item') {
		return
	}
	menuItems.forEach(item => {
		item.classList.remove('active')
	})
	target.classList.add('active')

	if (target.getAttribute('data-sort') === 'all') {
	}
	if (target.getAttribute('data-sort') === 'active') {
	}
	if (target.getAttribute('data-sort') === 'complited') {
	}
}

completeAllBtn.addEventListener('click', toggleStatusTasks)

list.addEventListener('click', onListClick)

input.addEventListener('keyup', onSubmut)

ulMenu.addEventListener('click', onSortMenuClick)
