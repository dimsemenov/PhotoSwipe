import React from 'react'

class ReactGithubStars extends React.Component {
  constructor() {
    super();
    this.state = {
      stars: null,
      loading: true
    }
  }

  componentDidMount() {
    this.setState({ loading: true })
    this.fetchGithub()
  }

  fetchGithub() {
    fetch(`https://api.github.com/repos/${this.props.repo}`)
      .then((response) => {
        response.json().then((data) => {
          this.setState({
            stars: parseInt(data.stargazers_count, 10) || 0,
            loading: false
          })
        })
      }).catch((response) => {
        if (response || response.status === 404) {
          this.setState({
            stars: 0,
            loading: false
          })
        }
      })
  }

  render() {
    return (
      <a href={`https://github.com/${this.props.repo}`} className="pswp-docs__github-link">
        <span className="pswp-docs__github-link-left">Github</span>
        <span className='pswp-docs__github-link-right'>
          <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16">
            <path fillRule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"></path>
          </svg>
          <span className="pswp-docs__github-link-star-count">{
            this.state.stars ? this.state.stars.toLocaleString() : ''
          }</span>
        </span>
      </a>
    )
  }
}

export default ReactGithubStars;
