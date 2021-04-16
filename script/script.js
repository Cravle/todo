// CONSTANTS
const ACTIVE = 'active'
const COMPLITED = 'complited'
const EDIT = 'edit'
const ALL = 'all'

// UTILS
const getElement = selector => document.querySelector(selector)
const isActive = task => task.status === ACTIVE
const isCompleted = task => task.status === COMPLITED
const generateId = () => Date.now()
const checkers = () => {
	checkTasksStatus()
	checkClearComplited()
	renderList()
}

// VARIABLES
const input = getElement('.input')
const taskItem = getElement('div')
const list = getElement('.tasks-list')
const counterItem = getElement('.status').querySelector('strong')
const footer = getElement('footer')
const completeAllBtn = getElement('[data-all]')
const ulMenu = getElement('.menu')
const menuItems = document.querySelectorAll('.menu__item')
const clearCompleteBtn = getElement('.clear-complited')

let taskList = []
let listToRender = taskList
let selectedType = ALL

const toggleStatusTasks = () => {
	const isSomeCompleted = taskList.some(isActive)
	taskList = taskList.map(task => ({ ...task, status: isSomeCompleted ? COMPLITED : ACTIVE }))

	checkers()
}

const checkTasksStatus = () => {
	taskList.every(isCompleted)
		? completeAllBtn.classList.add('active')
		: completeAllBtn.classList.remove('active')
}

const checkClearComplited = () => {
	if (!taskList.some(isCompleted)) {
		clearCompleteBtn.classList.add('display-none')
		return
	}

	const complitedCount = taskList.reduce((acc, task) => (task.status === COMPLITED ? acc + 1 : acc), 0)
	clearCompleteBtn.querySelector('span').innerText = `(${complitedCount})`
	clearCompleteBtn.classList.remove('display-none')
}

const createTaskByStatus = task => {
	switch (task.status) {
		case COMPLITED:
			return `
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
		case ACTIVE:
			return `
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
	}
}

const getTaskName = (names, taskName) => {
	const counterName = names.reduce(
		(accumulator, name) => (name === taskName ? accumulator + 1 : accumulator),
		0
	)

	names.push(taskName)
	return counterName ? `${taskName}[${counterName}]` : taskName
}

const renderList = () => {
	list.innerHTML = ''
	const names = []

	const newList = taskList.reduce((acc, task) => {
		if (task.status !== selectedType && selectedType !== ALL) {
			return acc
		}
		task.text = getTaskName(names, task.name)

		const taskItem = document.createElement('div')
		if (task.status === COMPLITED) {
			taskItem.innerHTML = createTaskByStatus(task)
			return [...acc, taskItem]
		}
		taskItem.innerHTML = createTaskByStatus(task)
		return [...acc, taskItem]
	}, [])

	refreshCounter()
	newList.forEach(el => list.appendChild(el))
}

const refreshCounter = () => {
	const counter = taskList.reduce((acc, { status }) => (status === ACTIVE ? acc + 1 : acc), 0)
	counterItem.innerText = counter
	return taskList.length ? footer.classList.remove('display-none') : footer.classList.add('display-none')
}

const onListClick = ({ target }) => {
	const id = Number(target.parentElement.dataset.id)
	const isDelited = target.classList.contains('task__btn-remove')
	const isChecked = target.classList.contains('check')
	if (isChecked) {
		taskList = taskList.map(task =>
			task.id === id ? { ...task, status: task.status === COMPLITED ? ACTIVE : COMPLITED } : task
		)
	}

	if (isDelited) {
		taskList = taskList.filter(task => task.id !== id)
	}
	checkers()
}

const onSubmut = ({ key }) => {
	const text = input.value.trim()

	if (key !== 'Enter' || !text.length) {
		return
	}

	const id = generateId()
	taskList.push({ text, name: text, status: ACTIVE, id })
	input.value = ''

	checkers()
}

const onSortMenuClick = ({ target }) => {
	if (target.className !== 'menu__item') {
		return
	}
	menuItems.forEach(item => {
		item.classList.remove('active')
	})
	target.classList.add('active')

	selectedType = target.getAttribute('data-sort')
	renderList()
}

const onClearComplitedClick = () => {
	taskList = taskList.filter(task => task.status !== COMPLITED)
	checkers()
}

completeAllBtn.addEventListener('click', toggleStatusTasks)

list.addEventListener('click', onListClick)

input.addEventListener('keyup', onSubmut)

ulMenu.addEventListener('click', onSortMenuClick)

clearCompleteBtn.addEventListener('click', onClearComplitedClick)
