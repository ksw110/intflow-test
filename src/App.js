import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Graph from './Graph';
import History from './History';
import './App.css';

function App() {
  const [isSubMenuOpen, setSubMenuOpen] = useState(false);
  const [clickedLink, setClickedLink] = useState('');

  const toggleSubMenu = () => {
    setSubMenuOpen(!isSubMenuOpen);
  };

  const handleLinkClick = (linkName) => {
    if (clickedLink === linkName) {
      
      setClickedLink('');
    } else {
      
      setClickedLink(linkName);
    }
  };

  return (
    <Router>
      <div className="container">
        <nav className="navbar">
          <div>
            <span className="title">edge farm</span>
            <span>Manager</span>
          </div>
          <p id="menu-title" onClick={toggleSubMenu}>
            급이{' '}
            {isSubMenuOpen ? (
              <span className="indicator">▼</span>
            ) : (
              <span className="indicator">▶</span>
            )}
          </p>
          <ul id="sub-title" className={isSubMenuOpen ? 'open' : ''}>
            <li>
              <Link
                to="/analysis"
                onClick={() => handleLinkClick('analysis')}
                style={{ color: clickedLink === 'analysis' ? 'red' : 'inherit' }}
              >
                급이 내역 분석
              </Link>
            </li>
            <li>
              <Link
                to="/management"
                onClick={() => handleLinkClick('management')}
                style={{ color: clickedLink === 'management' ? 'red' : 'inherit' }}
              >
                급이 내역 관리
              </Link>
            </li>
          </ul>
        </nav>

        <div className="content">
          <Routes>
            <Route path="/analysis" element={<Graph />} />
            <Route path="/management" element={<History />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
