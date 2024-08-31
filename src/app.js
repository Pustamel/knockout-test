const initialElements = [
  {
    title: 'Обязательные для всех',
    id: '1',
    type: 'category',
    elements: ko.observableArray([
      {
        title: 'Паспорт',
        id: '2',
        type: 'item',
        categoryId: '1'
      },
      {
        title: 'Инн',
        id: '3',
        type: 'item',
        categoryId: '1'
      }
    ])
  },
  {
    title: 'Обязательные для трудоустройства',
    id: '4',
    type: 'category',
    elements: ko.observableArray([])
  },
  {
    title: 'Специальные',
    id: '5',
    type: 'category',
    elements: ko.observableArray([
      {
        title: 'Паспорт',
        id: '6',
        type: 'item',
        categoryId: '5'
      },
      {
        title: 'Инн',
        id: '7',
        type: 'item',
        categoryId: '5'
      },
      {
        title: 'Инн 2',
        id: '8',
        type: 'item',
        categoryId: '5'
      }
    ])
  }
]

function findIndex (arr, element) {
  const categoryIndex = arr().findIndex(item => item.id === element.categoryId)
  const category = arr()[categoryIndex]
  const elementIndexInCategory = category.elements().findIndex(item => item.id === element.id)
  return {
    elementIndexInCategory,
    categoryIndex
  }
}


function AppViewModel () {
  this.newItems = ko.observableArray([...initialElements])

  this.draggedItemNew = null
  this.draggedItemNewDOM = ko.observable(null)

  // DRAG ELEMENT
  this.dragElement = (item, event) => {
    this.draggedItemNew = item
    this.draggedItemNewDOM(event.currentTarget)
    event.target.classList.add('dragging')
    event.dataTransfer.setDragImage(new Image(), 0, 0)
  }

  this.dragOver = (item, event) => {
    event.preventDefault()
    if (this.draggedItemNewDOM()) {
      // this.draggedItemNewDOM().style.left = `${event.clientX - this.draggedItemNewDOM().offsetWidth / 1.5}px`;
      // this.draggedItemNewDOM().style.top = `${event.clientY - this.draggedItemNewDOM().offsetHeight / 1.5}px`;
    }
  }

  this.dragEnterElement = (item, event) => {
    if (item !== this.draggedItemNew && this.draggedItemNew) {
      event.target.classList.add('drag-over__element-list')
    }
  }

  this.dragLeaveElement = (item, event) => {
    event.target.classList.remove('drag-over__element-list')
  }

  this.dropElement = (item, event) => {
    console.log(item, this.draggedItemNew)
    event.preventDefault()
    if (JSON.stringify(item) !== JSON.stringify(this.draggedItemNew) && this.draggedItemNew) {
      const fromIndex = findIndex(this.newItems, this.draggedItemNew)
      const toIndex = findIndex(this.newItems, item)

      // moving
      this.newItems()[fromIndex.categoryIndex].elements.splice(fromIndex.elementIndexInCategory, 1)
      this.newItems()[fromIndex.categoryIndex].elements.splice(toIndex.elementIndexInCategory, 0, this.draggedItemNew)
      this.newItems.valueHasMutated()
      this.draggedItemNewDOM(null)
    }
    event.target.classList.remove('drag-over__element-list')
  }

  this.dragEndElement = (item, event) => {
    event.target.classList.remove('dragging')
    this.draggedItemNew = null
  }

  // DRAG CATEGORY
  this.draggedCategory = null

  this.dragCategory = (item, event) => {
    this.draggedCategory = item
  }

  this.dragOverCategory = (item, event) => {
    event.preventDefault()
  }

  this.dragEnterCategory = (item, event) => {
    if (item !== this.draggedCategory && this.draggedCategory) {
      event.target.classList.add('drag-over__category')
    }
  }

  this.dragLeaveCategory = (item, event) => {
    console.log('leave')
    event.target.classList.remove('drag-over__category')
  }

  this.dropCategory = (item, event) => {
    event.preventDefault()
    const isCategoryMoving = item.id !== this.draggedCategory.id && this.draggedCategory?.type === 'category' && item.type === 'category'
    const isBetweenCategoryMoving = this.draggedItemNew?.type === 'item' && item.type === 'category' && this.draggedItemNew.categoryId !== item.id
    if (isBetweenCategoryMoving) { //drop between different category
      const fromIndex = findIndex(this.newItems, this.draggedItemNew)
      const toIndex = this.newItems().findIndex(category => category.id === item.id)
      // moving
      this.newItems()[fromIndex.categoryIndex].elements.splice(fromIndex.elementIndexInCategory, 1)
      this.draggedItemNew.categoryId = item.id
      this.newItems()[toIndex].elements.splice(toIndex, 0, this.draggedItemNew)
      this.newItems.valueHasMutated()
    } else if (isCategoryMoving) {
      const fromIndex = this.newItems().findIndex(category => category.id === this.draggedCategory.id)
      const toIndex = this.newItems().findIndex(category => category.id === item.id)
      // moving
      this.newItems().splice(fromIndex, 1);
      this.newItems().splice(toIndex, 0, this.draggedCategory);
      this.newItems.valueHasMutated()
    }
    event.target.classList.remove('drag-over__category')
  }

  this.dragEndCategory = (item, event) => {
    event.target.classList.remove('dragging')
    this.draggedCategory = null
  }
}


ko.applyBindings(new AppViewModel())