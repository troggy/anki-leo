const categories = {
  0: 'all',
  1: 'word',
  2: 'phrase',
  3: 'sentence'
}

const statuses = {
  0: 'all',
  1: 'new',
  2: 'learning',
  3: 'learned'
}

const getSelectedCategory = () => {
  const selectedCat = document.querySelector(
    '.ll-page-vocabulary__filter__select .ll-select-option__m-selected'
  )

  if (!selectedCat) return categories[0]

  const selectedCategoryIndex = [].slice.call(
    selectedCat.parentNode.childNodes
  ).findIndex(a => a.classList.contains('ll-select-option__m-selected'))

  return categories[selectedCategoryIndex]
}

const getSelectedStatus = () => {
  const toggleGroup = document.querySelector(
    '.ll-page-vocabulary__filter__toggle .ll-toggle-group'
  )

  const selectedStatusIndex = [].slice.call(toggleGroup.childNodes)
    .findIndex(a => a.classList.contains('ll-toggle-group-option__m-selected'))
  
    console.log(selectedStatusIndex);
  return statuses[selectedStatusIndex]
}

const getSearchQuery = () => {
  const activeSearch = document.querySelector('.ll-leokit__input__m-with-action');
  if (!activeSearch) return ''

  return activeSearch.value
}

export default () => ({
  category: getSelectedCategory(),
  status: getSelectedStatus(),
  search: getSearchQuery(),
})