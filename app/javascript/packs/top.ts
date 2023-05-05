const jsFadeInTarget = document.getElementsByClassName('js-fade-in') as HTMLCollectionOf<HTMLDivElement>;

window.addEventListener('scroll', () => {
  for(let i = 0; i < jsFadeInTarget.length; i++) {
    const rect = jsFadeInTarget[i].getBoundingClientRect().top;
    const scroll = window.pageYOffset || document.documentElement.scrollTop;
    const offset = rect + scroll;
    const windowHeight = window.innerHeight;

    if(scroll > offset - windowHeight + 150) {
      jsFadeInTarget[i].classList.add('scroll-in');
    }
  }
});
