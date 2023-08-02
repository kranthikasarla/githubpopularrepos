import {Component} from 'react'
import Loader from 'react-loader-spinner'

import LanguageFilterItems from '../LanguageFilterItem'
import RepositoryItem from '../RepositoryItem'
import './index.css'

const languageFiltersData = [
  {id: 'ALL', language: 'All'},
  {id: 'JAVASCRIPT', language: 'Javascript'},
  {id: 'RUBY', language: 'Ruby'},
  {id: 'JAVA', language: 'Java'},
  {id: 'CSS', language: 'CSS'},
]

// Write your code here
const apiUrl = 'https://apis.ccbp.in/popular-repos?language='

class GithubPopularRepos extends Component {
  state = {
    isLoading: true,
    repositoriesData: [],
    selectedLanguagesFilter: 'ALL',
  }

  componentDidMount() {
    this.getRepositories(languageFiltersData[0].id)
  }

  setRepositories = (fetchedData, loadingStatus) => {
    this.setState({
      repositoriesData: fetchedData,
      isLoading: loadingStatus,
    })
  }

  setIsLoading = loadingStatus => {
    this.setState({isLoading: loadingStatus})
  }

  getRepositories = async selectedLanguagesFilter => {
    this.setIsLoading(true)
    const response = await fetch(`${apiUrl}${selectedLanguagesFilter}`)
    const fetchedData = await response.json()

    const updatedData = fetchedData.popular_repos.map(eachRepository => ({
      id: eachRepository.id,
      imageUrl: eachRepository.avatar_url,
      name: eachRepository.name,
      starsCount: eachRepository.stars_count,
      forksCount: eachRepository.forks_count,
      issuesCount: eachRepository.issues_count,
    }))
    this.setRepositories(updatedData, false)
  }

  renderRepositoriesList = () => {
    const {repositoriesData} = this.state

    return (
      <ul>
        {repositoriesData.map(repositoryData => (
          <RepositoryItem
            key={repositoryData.id}
            repositoryData={repositoryData}
          />
        ))}
      </ul>
    )
  }

  renderLoader = () => (
    <div data-testid="loader">
      <Loader color="#0284c7" height={80} type="ThreeDots" width={80} />
    </div>
  )

  setSelectedLanguageFilterAndGetRepositories = newFilterId => {
    this.setState({selectedLanguagesFilter: newFilterId})
    this.getRepositories(newFilterId)
  }

  renderLanguageFiltersList = () => {
    const {selectedLanguagesFilter} = this.state
    return (
      <ul className="filter-list-container">
        <li>
          {languageFiltersData.map(eachLanguageFilter => (
            <LanguageFilterItems
              isSelected={eachLanguageFilter.id === selectedLanguagesFilter}
              key={eachLanguageFilter.id}
              languageFilter={eachLanguageFilter}
              setSelectedLanguageFilterAndGetRepositories={
                this.setSelectedLanguageFilterAndGetRepositories
              }
            />
          ))}
        </li>
      </ul>
    )
  }

  render() {
    const {isLoading} = this.state
    return (
      <div>
        <div>
          <h1>Popular</h1>
          {this.renderLanguageFiltersList()}
          {isLoading ? this.renderLoader() : this.renderRepositoriesList()}
        </div>
      </div>
    )
  }
}
export default GithubPopularRepos
