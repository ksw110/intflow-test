import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import './Popup.css';


function Popup({ onClose }) {
  const [feederkg, setFeederkg] = useState(''); // 급이량 상태를 관리하는 변수
  const [dropdown1, setDropdown1] = useState(''); // 드롭다운 선택 상태를 관리하는 변수
  const [feeder, setFeeder] = useState([]); // 급이기 목록을 저장하는 배열 변수
  const [selectedDate, setSelectedDate] = useState(null); // 선택된 날짜를 관리하는 변수
  const [toastMessage, setToastMessage] = useState(''); // 토스트 메시지를 관리하는 변수

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://intflowserver2.iptime.org:44480/feeder/list');
        const feeder = await response.json();
        setFeeder(feeder);
      } catch (error) {
        console.error('An error occurred', error);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    if (toastMessage) {
      const timeout = setTimeout(() => {
        setToastMessage('');
      }, 2000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [toastMessage]);
  // 스피너 증가 10씩 할때 990에서 멈춤 핸들러이용하여 맞추기
  const handleNameChange = (event) => {
    const newValue = event.target.value;
    if (newValue === '1000') {
        event.target.value = 999;
        
    }
    setFeederkg(event.target.value);
    
  };

  const handleDropdown1Change = (event) => {
    setDropdown1(event.target.value);
  };


  const handleDateChange = (event) => {
    const dateValue = event.target.value;
    setSelectedDate(dateValue);
    console.log(dateValue);
  };

  const handleSave = async () => {
    
    const data = {
      feeder_id: dropdown1,
      amount: parseInt(feederkg),
      created_date: selectedDate
    };
console.log(data);
    try {
      const response = await fetch('http://intflowserver2.iptime.org:44480/feeder_log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        setToastMessage('저장 완료');
      } else {
        setToastMessage('저장 실패');
      }
    } catch (error) {
      console.error('An error occurred', error);
    }
  };

  const handleClose = () => {
    onClose();
  };
  useEffect(() => {
    const currentDate = new Date().toISOString().split('T')[0];
    setSelectedDate(currentDate);
  }, []);

  return (
    <div className="popup-container">
      <div className="popup">
      <button className="button-container" onClick={handleClose}>X</button>

        <h2>수기입력</h2>
        
        <div className="input-container">
          <label>급이기 </label>
          <select value={dropdown1} onChange={handleDropdown1Change}>
            <option value="" className="placeholder">급이기</option>
            {feeder.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <div className="input-container ">
            
          <label>급이량(Kg) </label>
          {toastMessage && (
        <div className="toast">{toastMessage}</div> // 토스트 메시지 렌더링
      )}
          <input type="number" value={feederkg} onChange={handleNameChange} placeholder="0" max="1000" min="0" step="10"/>
        </div>

        <div className="input-container">
          <label>급이일자 </label>
          <input type="date" value={selectedDate} onChange={handleDateChange}/>
        </div>
        <div className="button-container">
          <button onClick={handleSave}>저장</button>
        </div>
      </div>
      
    </div>
    
  );
}

export default Popup;
