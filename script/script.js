window.addEventListener('DOMContentLoaded', () => {
	// CONSTANTS
	const ACTIVE = 'active'
	const COMPLETED = 'completed'
	const EDIT = 'edit'
	const ALL = 'all'

	// UTILS
	const getElement = selector => document.querySelector(selector)
	const isActive = task => task.status === ACTIVE
	const isCompleted = task => task.status === COMPLETED
	const generateId = () => Date.now()
	const checkers = () => {
		checkTasksStatus()
		countTask()
		renderList()
		saveDataToLocalStorage()
	}

	// VARIABLES
	const input = getElement('.input')
	const list = getElement('.tasks-list')
	const counterItem = getElement('.status').querySelector('strong')
	const footer = getElement('footer')
	const completeAllBtn = getElement('[data-all]')
	const ulMenu = getElement('.menu')
	const filters = document.querySelectorAll('.menu__item')
	const clearCompleteBtn = getElement('.clear-completed')

	let taskList = []
	let selectedType = ALL

	const windowOnLoad = () => {
		if (localStorage.taskList) {
			taskList = JSON.parse(localStorage.getItem('taskList'))
		}
		if (localStorage.selectedType) {
			selectedType = localStorage.getItem('selectedType')
		}
		checkers()
		changeFilter()
	}

	const saveDataToLocalStorage = () => {
		localStorage.taskList = JSON.stringify(taskList)
		localStorage.selectedType = selectedType
	}

	const toggleStatusTasks = () => {
		const isSomeCompleted = taskList.some(isActive)
		taskList = taskList.map(task => ({ ...task, status: isSomeCompleted ? COMPLETED : ACTIVE }))

		checkers()
	}

	const checkTasksStatus = () => {
		const isAllCompleted = taskList.every(isCompleted)

		if (!taskList.length || !isAllCompleted) {
			completeAllBtn.classList.remove('active')
			return
		}
		completeAllBtn.classList.add('active')
	}

	const countTask = () => {
		const { activeTask, completedTask } = taskList.reduce(
			(acc, { status }) =>
				status === ACTIVE
					? { ...acc, activeTask: acc.activeTask + 1 }
					: { ...acc, completedTask: acc.completedTask + 1 },
			{
				activeTask: 0,
				completedTask: 0,
			}
		)

		counterItem.innerText = activeTask
		taskList.length ? footer.classList.remove('hidden') : footer.classList.add('hidden')

		if (!taskList.some(isCompleted)) {
			clearCompleteBtn.classList.add('hidden')
			return
		}

		clearCompleteBtn.querySelector('span').innerText = `(${completedTask})`
		clearCompleteBtn.classList.remove('hidden')
	}

	const createTask = task => {
		const taskItem = document.createElement('div')
		taskItem.classList.add('border-bottom')

		if (task.isEdit) {
			taskItem.innerHTML = `
      <li class="task wrapper" data-id="${task.id}">
        <button class="check hidden" >✔</button>
        <div class="task__wrapper">
          <input class="task__input light-black" value="${task.text}" />
      </div>
      <button class="task__btn-remove hidden" >✖</button>
    </li>
    `
			return taskItem
		}

		if (task.status === COMPLETED) {
			taskItem.innerHTML = `
      <li class="task wrapper" data-id="${task.id}">
        <button class="check checked">✔</button>
        <div class="task__wrapper">
          <div class="task__text completed light-black ">${task.text}</div>
      </div>
      <button class="task__btn-remove">✖</button>
    </li>
      `
			return taskItem
		}

		taskItem.innerHTML = `
        <li class="task wrapper" data-id="${task.id}">
          <button class="check">✔</button>
          <div class="task__wrapper">
            <div class="task__text light-black ">${task.text}</div>
        </div>
        <button class="task__btn-remove">✖</button>
      </li>
        `

		return taskItem
	}

	const getTaskName = (names, taskName) => {
		const counterName = names.reduce(
			(accumulator, name) => (name === taskName ? accumulator + 1 : accumulator),
			0
		)

		return counterName ? `${taskName}[${counterName}]` : taskName
	}

	const renderList = () => {
		list.innerHTML = ''
		const names = []

		taskList = taskList.filter(task => task.name.trim().length)

		const newList = taskList.reduce((acc, task) => {
			if (task.status !== selectedType && selectedType !== ALL) {
				return acc
			}
			task.text = getTaskName(names, task.name)
			names.push(task.text)

			const taskItem = createTask(task)
			return [...acc, taskItem]
		}, [])
		countTask()
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

	const onSubmit = ({ key }) => {
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
			task.id === id ? { ...task, status: task.status === COMPLETED ? ACTIVE : COMPLETED } : task
		)
		checkers()
	}

	const onRemoveClick = ({ target }) => {
		const id = Number(target.parentElement.dataset.id)
		taskList = taskList.filter(task => task.id !== id)
		checkers()
	}

	const changeFilter = () => {
		filters.forEach(item => {
			if (item.getAttribute('data-sort') === selectedType) {
				item.classList.add('active')
			} else {
				item.classList.remove('active')
			}
		})
	}

	const onInputBlur = e => {
		const id = Number(e.target.parentElement.parentElement.dataset.id)
		taskList = taskList.map(task =>
			task.id === id ? { ...task, name: e.target.value, isEdit: false } : task
		)
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

		selectedType = target.getAttribute('data-sort')
		changeFilter()
		renderList()
		saveDataToLocalStorage()
	}

	const onClearCompletedClick = () => {
		taskList = taskList.filter(task => task.status !== COMPLETED)
		checkers()
	}

	completeAllBtn.addEventListener('click', toggleStatusTasks)

	input.addEventListener('keyup', onSubmit)

	ulMenu.addEventListener('click', onSortMenuClick)

	clearCompleteBtn.addEventListener('click', onClearCompletedClick)

	windowOnLoad()
})
