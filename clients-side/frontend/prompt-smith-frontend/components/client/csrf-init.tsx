'use client'
import {useEffect} from "react";


import {getCSRFToken} from "@/lib/auth/cookieUtils";


const CSRFInit = () => {
  const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  useEffect(() => {
    // fetch init url to set up csrf and session cookie
    fetch(`${url}/auth/browser/init/`, {
      method: 'GET',
      credentials: 'include', // Ensures cookies are included in the request
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Failed to fetch CSRF token');
      })
      .then(data => {
        console.log('CSRF setup successful', data);
        // Further processing if necessary
      })
      .catch(error => {
        console.error('Error setting CSRF:', error);
      });


  }, []);

  const loginIn = async () => {

    const csrfValue = getCSRFToken() || ''

    //   login through email and password
    fetch(`${url}/auth/browser/v1/auth/login`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-CSRFToken': csrfValue,
      },
      body: JSON.stringify({
        email: 'admin@localhost.lan',
        password: 'AwesomePromptsManagement'
      })
    }).then(response => {
      console.log('login response', response)
      // get cookie from response
    })
  }

  return (
    <div>
      <h1>Test</h1>
      <button onClick={loginIn}>Login</button>
    </div>
  )
}


export default CSRFInit
