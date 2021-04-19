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
let selectedType = ALL

const toggleStatusTasks = () => {
	const isSomeCompleted = taskList.some(isActive)
	taskList = taskList.map(task => ({ ...task, status: isSomeCompleted ? COMPLITED : ACTIVE }))

	checkers()
}

const checkTasksStatus = () => {
	if (!taskList.length) {
		completeAllBtn.classList.remove('active')
		return
	}
	taskList.every(isCompleted)
		? completeAllBtn.classList.add('active')
		: completeAllBtn.classList.remove('active')
}

const checkClearComplited = () => {
	if (!taskList.some(isCompleted)) {
		clearCompleteBtn.classList.add('hidden')
		return
	}

	const complitedCount = taskList.reduce((acc, task) => (task.status === COMPLITED ? acc + 1 : acc), 0)
	clearCompleteBtn.querySelector('span').innerText = `(${complitedCount})`
	clearCompleteBtn.classList.remove('hidden')
}

const createTaskByStatus = task => {
	if (task.isEdit) {
		return `
      <li class="task wrapper" data-id="${task.id}">
        <button class="check hidden" >✔</button>
        <div class="task__wrapper">
          <input class="task__input light-black" value="${task.text}" autofocus/>
      </div>
      <button class="task__btn-remove hidden" >✖</button>
    </li>
    `
	}

	if (task.status == COMPLITED) {
		return `
      <li class="task wrapper" data-id="${task.id}">
        <button class="check checked">✔</button>
        <div class="task__wrapper">
          <div class="task__text complited light-black ">${task.text}</div>
      </div>
      <button class="task__btn-remove">✖</button>
    </li>
      `
	} else {
		return `
        <li class="task wrapper" data-id="${task.id}">
          <button class="check">✔</button>
          <div class="task__wrapper">
            <div class="task__text light-black ">${task.text}</div>
        </div>
        <button class="task__btn-remove">✖</button>
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

	taskList = taskList.filter(task => task.name.length)

	const newList = taskList.reduce((acc, task) => {
		if (task.status !== selectedType && selectedType !== ALL) {
			return acc
		}

		task.text = getTaskName(names, task.name)

		const taskItem = document.createElement('div')
		taskItem.classList.add('border-bottom')
		if (task.status === COMPLITED) {
			taskItem.innerHTML = createTaskByStatus(task)
			return [...acc, taskItem]
		}
		taskItem.innerHTML = createTaskByStatus(task)
		return [...acc, taskItem]
	}, [])

	refreshCounter()
	newList.forEach(el => list.appendChild(el))

	const checkerBtns = list.querySelectorAll('.check')
	checkerBtns.forEach(checkItem => checkItem.addEventListener('click', onCheckClick))

	const removeBtns = list.querySelectorAll('.task__btn-remove')
	removeBtns.forEach(removeItem => removeItem.addEventListener('click', onRemoveClick))

	const textItems = list.querySelectorAll('.task__text')
	textItems.forEach(textItem => textItem.addEventListener('dblclick', onTextDblClick))

	const taskInput = list.querySelector('.task__input')
	if (taskInput) {
		taskInput.focus()
		taskInput.addEventListener('blur', onInputBlur)
		taskInput.addEventListener('keyup', onKeyUpBlur)
	}
}

const refreshCounter = () => {
	const counter = taskList.reduce((acc, { status }) => (status === ACTIVE ? acc + 1 : acc), 0)
	counterItem.innerText = counter
	return taskList.length ? footer.classList.remove('hidden') : footer.classList.add('hidden')
}

const onSubmut = ({ key }) => {
	const text = input.value.trim()

	if (key !== 'Enter' || !text.length) {
		return
	}

	const id = generateId()
	taskList.push({ text, name: text, status: ACTIVE, id, isEdit: false })
	input.value = ''

	checkers()
}

const onCheckClick = ({ target }) => {
	const id = Number(target.parentElement.dataset.id)
	taskList = taskList.map(task =>
		task.id === id ? { ...task, status: task.status === COMPLITED ? ACTIVE : COMPLITED } : task
	)
	checkers()
}

const onRemoveClick = ({ target }) => {
	const id = Number(target.parentElement.dataset.id)
	taskList = taskList.filter(task => task.id !== id)
	checkers()
}

const onInputBlur = e => {
	const id = Number(e.target.parentElement.parentElement.dataset.id)
	taskList = taskList.map(task => (task.id === id ? { ...task, name: e.target.value, isEdit: false } : task))
	checkers()
}

const onKeyUpBlur = e => {
	e.key === 'Enter' && onInputBlur(e)
}

const onTextDblClick = ({ target }) => {
	const id = Number(target.parentElement.parentElement.dataset.id)
	taskList = taskList.map(task => (task.id === id ? { ...task, isEdit: true } : task))
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

const onListDoubleClick = ({ target }) => {
	const id = Number(target.parentElement.parentElement.dataset.id)
	taskList = taskList.map(task => ({ ...task, status: task.id === id ? EDIT : task.status }))
	renderList()
}

completeAllBtn.addEventListener('click', toggleStatusTasks)

input.addEventListener('keyup', onSubmut)

ulMenu.addEventListener('click', onSortMenuClick)

clearCompleteBtn.addEventListener('click', onClearComplitedClick)
