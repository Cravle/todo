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

class Task {
	constructor({ text, name, status, id = generateId() }) {
		this.text = text
		this.name = name
		this.status = status
		this.id = id
		this.isEdit = false
	}

	ToggleStatus() {
		this.status = this.status === ACTIVE ? COMPLETED : ACTIVE
	}

	Create() {
		const taskItem = document.createElement('div')
		taskItem.classList.add('border-bottom')

		if (this.isEdit) {
			taskItem.innerHTML = `
      <li class="task wrapper" data-id="${this.id}">
        <button class="check hidden" >✔</button>
        <div class="task__wrapper">
          <input class="task__input light-black" value="${this.text}" />
      </div>
      <button class="task__btn-remove hidden" >✖</button>
    </li>
    `
			return taskItem
		}

		if (this.status === COMPLETED) {
			taskItem.innerHTML = `
      <li class="task wrapper" data-id="${this.id}">
        <button class="check checked">✔</button>
        <div class="task__wrapper">
          <div class="task__text completed light-black ">${this.text}</div>
      </div>
      <button class="task__btn-remove">✖</button>
    </li>
      `
			return taskItem
		}
		taskItem.innerHTML = `
			<li class="task wrapper" data-id="${this.id}">
				<button class="check">✔</button>
				<div class="task__wrapper">
					<div class="task__text light-black ">${this.text}</div>
			</div>
			<button class="task__btn-remove">✖</button>
		</li>
			`
		return taskItem
	}

	CreateTextByName(names) {
		const counterName = names.reduce(
			(accumulator, name) => (name === this.name ? accumulator + 1 : accumulator),
			0
		)

		this.text = counterName ? `${this.name}[${counterName}]` : this.name
	}
}

window.addEventListener('DOMContentLoaded', () => {
	const input = getElement('.input')
	const list = getElement('.tasks-list')
	const counterItem = getElement('.status').querySelector('strong')
	const footer = getElement('footer')
	const completeAllBtn = getElement('[data-all]')
	const ulMenu = getElement('.menu')
	const filters = document.querySelectorAll('.menu__item')
	const clearCompleteBtn = getElement('.clear-completed')

	class MakeTodoList {
		taskList = []

		constructor(parent) {
			this.parent = parent
			this.selectedType = localStorage.getItem('selectedType') || ALL
		}

		push(task) {
			this.taskList.push(task)
		}

		render() {
			this.parent.innerHTML = ''
			const names = []
			this.taskList = this.taskList.filter(task => task.name.trim().length)
			const newList = this.taskList.reduce((acc, task) => {
				if (task.status !== this.selectedType && this.selectedType !== ALL) {
					return acc
				}
				task.CreateTextByName(names)
				names.push(task.name)

				const taskItem = task.Create()
				return [...acc, taskItem]
			}, [])
			this.countTask()
			this.checkAllStatus()
			this.saveDataToLocalStorage()
			newList.forEach(el => this.parent.appendChild(el))

			const checkerBtns = this.parent.querySelectorAll('.check')
			checkerBtns.forEach(checkItem => checkItem.addEventListener('click', this.onCheckClick.bind(this)))

			const removeBtns = this.parent.querySelectorAll('.task__btn-remove')
			removeBtns.forEach(removeItem => removeItem.addEventListener('click', this.onRemoveClick.bind(this)))

			const textItems = this.parent.querySelectorAll('.task__text')
			textItems.forEach(textItem => textItem.addEventListener('dblclick', this.onTextDblClick.bind(this)))

			const taskInput = this.parent.querySelector('.task__input')
			if (taskInput) {
				taskInput.focus()
				taskInput.addEventListener('blur', this.onInputBlur.bind(this))
				taskInput.addEventListener('keyup', this.onKeyUp.bind(this))
			}
		}

		saveDataToLocalStorage() {
			localStorage.taskList = JSON.stringify(this.taskList)
			localStorage.selectedType = this.selectedType
		}

		checkAllStatus() {
			const isAllCompleted = this.taskList.every(isCompleted)

			if (!this.taskList.length || !isAllCompleted) {
				completeAllBtn.classList.remove('active')
				return
			}
			completeAllBtn.classList.add('active')
		}

		countTask() {
			const { activeTask, completedTask } = this.taskList.reduce(
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
			this.taskList.length ? footer.classList.remove('hidden') : footer.classList.add('hidden')
			if (!completedTask) {
				clearCompleteBtn.classList.add('hidden')
				return
			}

			clearCompleteBtn.querySelector('span').innerText = `(${completedTask})`
			clearCompleteBtn.classList.remove('hidden')
		}

		clearCompleted() {
			this.taskList = this.taskList.filter(task => task.status !== COMPLETED)
		}

		toggleStatusTasks() {
			const isSomeCompleted = this.taskList.some(isActive)
			this.taskList.forEach(task => {
				task.status = isSomeCompleted ? COMPLETED : ACTIVE
			})
		}

		onCheckClick({ target }) {
			const id = Number(target.parentElement.dataset.id)
			const task = this.taskList.find(task => task.id === id)
			task.ToggleStatus()

			this.render()
		}

		onRemoveClick = ({ target }) => {
			const id = Number(target.parentElement.dataset.id)
			this.taskList = this.taskList.filter(task => task.id !== id)
			this.render()
		}

		onTextDblClick({ target }) {
			const id = Number(target.parentElement.parentElement.dataset.id)
			const task = this.taskList.find(task => task.id === id)
			task.isEdit = true

			this.render()
		}

		onInputBlur(e) {
			e.preventDefault()
			const id = Number(e.target.parentElement.parentElement.dataset.id)
			const task = this.taskList.find(task => task.id === id)
			task.name = e.target.value
			task.isEdit = false
			this.render()
			return false
		}

		onKeyUp(e) {
			e.preventDefault()
			e.key === 'Enter' && this.onInputBlur(e)
			return false
		}
	}

	const taskList = new MakeTodoList(list)

	const onSubmit = ({ key }) => {
		const text = input.value.trim()

		if (key !== 'Enter' || !text.length) {
			return
		}

		taskList.push(new Task({ text, name: text, status: ACTIVE }))
		input.value = ''

		taskList.render()
	}

	const windowOnLoad = () => {
		if (localStorage.taskList) {
			const savedTasks = JSON.parse(localStorage.getItem('taskList'))
			savedTasks.forEach(task => {
				taskList.push(new Task(task))
			})
		}

		taskList.render()
		changeFilter()
	}

	const toggleStatusTasks = () => {
		taskList.toggleStatusTasks()

		taskList.render()
	}

	const changeFilter = () => {
		filters.forEach(filter => {
			if (filter.getAttribute('data-sort') === taskList.selectedType) {
				filter.classList.add('active')
			} else {
				filter.classList.remove('active')
			}
		})
	}

	const onSortMenuClick = ({ target }) => {
		if (target.className !== 'menu__item') {
			return
		}

		taskList.selectedType = target.getAttribute('data-sort')
		changeFilter()
		taskList.render()
	}

	const onClearCompletedClick = () => {
		taskList.clearCompleted()
		taskList.render()
	}

	completeAllBtn.addEventListener('click', toggleStatusTasks)

	input.addEventListener('keyup', onSubmit)

	ulMenu.addEventListener('click', onSortMenuClick)

	clearCompleteBtn.addEventListener('click', onClearCompletedClick)

	windowOnLoad()
})
