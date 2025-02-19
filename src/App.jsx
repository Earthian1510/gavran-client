import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import "bootstrap-icons/font/bootstrap-icons.css";
import './App.css'
import Header from './components/Header'
import CategorySlider from './features/category/CategorySlider';
import { useFetch } from './utils/useFetch';
import { API } from './api'

const App = () => {
  // const { data, error } = useFetch(API.signup)
  // console.log(data)
  // console.log(error)

  return (
    <div>
      <Header/>
      <main className="container">
        <CategorySlider />
      </main>
    </div>
  )
}

export default App