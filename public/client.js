;(function() {
  const form = document.getElementById('form')
  const recipe = document.getElementById('recipe')
  const h1 = document.querySelector('h1')
  const container = document.querySelector('.container')

  // create and append html tags to '.container'
  function renderRecipe(xhrResponse) {
    const recipeArray = xhrResponse.recipes
    recipeArray.forEach(element => {
      // create html a tag
      let a = document.createElement('a')
      a.className = 'link'
      a.href = `https://${element.f2f_url.slice(7)}`
      a.target = '_blank'
      // create html div tag
      let div = document.createElement('div')
      div.className = 'cover-wrap'
      div.style.backgroundImage = `url(https://${element.image_url.slice(7)})`
      // create html p tag
      let p = document.createElement('p')
      p.className = 'title'
      let pNode = document.createTextNode(element.title)
      p.appendChild(pNode)
      // append div and p tags, then append a to container
      a.appendChild(div)
      a.appendChild(p)
      container.appendChild(a)
    })
  }

  function getRecipe(e) {
    let recipeName = recipe.value.trim()
    recipe.value = '' // reset input

    h1.textContent = 'Loading...'
    container.innerHTML = '' // reset container content

    // AJAX call
    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
        let response = JSON.parse(xhr.responseText)
        // console.log(response)
        if (response.error === 'limit') {
          h1.textContent = 'Max query hit, please come tomorrow :)'
          return
        }
        h1.textContent = `Enjoy your recipes!`
        renderRecipe(response)
      }
    }
    xhr.open('POST', `/ingredients`)
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8')
    xhr.send(JSON.stringify({ingredient: recipeName}))

    e.preventDefault()
    e.stopPropagation()
  }

  // start after DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    form.addEventListener('submit', getRecipe)
  })
})()
