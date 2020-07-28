
const $ = s => document.querySelector(s)
const $$ = s => document.querySelectorAll(s)
const isMain = str => (/^#{1,2}(?!#)/).test(str)
const isSub = str => (/^#{3}(?!#)/).test(str)

function convert(raw) {
  let arr = raw.split(/\n(?=\s*#{1,3}[^#])/).filter(s => s !== "").map(s => s.trim())

  let html = ''
  for(let i=0; i<arr.length; i++) {

    if(arr[i+1] !== undefined) {
      if(isMain(arr[i]) && isMain(arr[i+1])) {
        html += `
<section data-markdown>
<textarea data-template>
${arr[i]}
</textarea>
</section>
`
      } else if(isMain(arr[i]) && isSub(arr[i+1])) {
        html += `
<section>
<section data-markdown>
<textarea data-template>
${arr[i]}
</textarea>
</section>
`
      } else if(isSub(arr[i]) && isSub(arr[i+1])) {
        html += `
<section data-markdown>
<textarea data-template>
${arr[i]}
</textarea>
</section>
`
      } else if(isSub(arr[i]) && isMain(arr[i+1])) {
        html += `
<section data-markdown>
<textarea data-template>
${arr[i]}
</textarea>
</section>
</section>
`
      }      

    } else {
      if(isMain(arr[i])) {
        html += `
<section data-markdown>
<textarea data-template>
${arr[i]}
</textarea>
</section>
`        
      } else if(isSub(arr[i])) {
        html += `
<section data-markdown>
<textarea data-template>
${arr[i]}
</textarea>
</section>
</section>
`        
      }
    }

  }

  return html
}


const Menu = {
init(){
  console.log('menu')
  this.$settingIcon = $('.control .icon-setting')
  this.$menu  = $('.menu')
  this.$closeIcon = $('.menu .icon-close')
  this.$$tabs = $$('.menu .tab')
  this.$$contents = $$('.menu .content')

  this.bind()
},

  bind(){
  this.$settingIcon.onclick =()=> {
    this.$menu.classList.add('open')
   }
   this.$closeIcon.onclick=()=>{
    this.$menu.classList.remove('open')
   }
   this.$$tabs.forEach($tab => $tab.onclick = ()=> {
     this.$$tabs.forEach($node=>$node.classList.remove('active'))
     $tab.classList.add('active')
     let index = [...this.$$tabs].indexOf($tab)
     this.$$contents.forEach($node=>$node.classList.remove('active'))
     this.$$contents[index].classList.add('active')
   })
  }
}

const Editor = {
  init(){
    console.log('editor')
    this.$editInput = $('.edit textarea')
    this.$saveBtn = $('.edit .button-save')
    this.markdown = localStorage.markdown || `# one slide`
    this.$slideContainer = $('.slides')
    this.bind()
    this.start()
  },
  bind(){
    this.$saveBtn.onclick = () => {
      localStorage.markdown = this.$editInput.value
      location.reload()
    }
  },
  start(){
    this.$editInput.value = this.markdown
    this.$slideContainer.innerHTML = convert(this.markdown)
    Reveal.initialize({
      controls: true,
      progress: true,
      center: true,
      hash: true,

      // Learn about plugins: https://revealjs.com/plugins/
      plugins: [ RevealZoom, RevealNotes, RevealSearch, RevealMarkdown, RevealHighlight ]
    });
  }

}

const Theme = {
  init(){

    this.$$figures = $$('.themes figure')

    this.bind()
    this.loadTheme()
  },

  bind(){
    this.$$figures.forEach($figure=>$figure.onclick=()=>{
      this.$$figures.forEach($item=>$item.classList.remove('select'))
      $figure.classList.add('select')
      this.setTheme($figure.dataset.theme)
    })
  },
  setTheme(theme){
    localStorage.theme = theme
    location.reload()
  },
  loadTheme(){
    let theme = localStorage.theme || 'black'
    let $link = document.createElement('link')
    $link.rel = 'stylesheet'
    $link.href = `dist/theme/${theme}.css`
    document.head.appendChild($link)
  }
}

const App = {
init (){
  [...arguments].forEach(Module=>Module.init())
}
}


App.init(Menu,Editor,Theme)



