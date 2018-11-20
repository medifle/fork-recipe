
(function() {
  const form = document.getElementById('form')
  const recipe = document.getElementById('recipe')
  const h1 = document.querySelector('h1')
  const container = document.querySelector('.container')

  function getRecipe(e) {
    recipeName = recipe.value.trim()
    recipe.value = ''

    h1.textContent = 'Loading...'
    container.innerHTML = ''

    // ajax call
    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
        let response = JSON.parse(xhr.responseText)
        container.innerHTML = response.recipes
        h1.textContent = `Enjoy your recipes!`
      }
    }
    xhr.open('POST', `/ingredients`)
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8')
    xhr.send(JSON.stringify({ ingredient: recipeName }))

    e.preventDefault()
    e.stopPropagation()
  }

  // start after DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    form.addEventListener('submit', getRecipe)
  })

}())
