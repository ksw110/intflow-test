import React, { useState, useEffect } from 'react';
import './History.css';
import Popup from './Popup';

const History = () => {
  const [isPopupOpen, setPopupOpen] = useState(false); // 팝업 열림 여부
  const [selectedPeriod, setSelectedPeriod] = useState(''); // 선택된 기간
  const [startDate, setStartDate] = useState(''); // 시작 날짜
  const [endDate, setEndDate] = useState(''); // 종료 날짜
  const [feeder, setFeeder] = useState([]); // 급이기 목록
  const [selectedFeeders, setSelectedFeeders] = useState([]); // 선택된 급이기 목록
  const [feederlist, setFeederlist] = useState([]); // 급이 내역 목록
  const [feederlist1, setFeederlist1] = useState([]); // 급이 내역 목록 id별로 정렬
  const [sortOrder, setSortOrder] = useState('asc');  // 정렬 순서

  const handleSortOrderChange = () => {
    // 현재 정렬 순서에 따라 반대로 변경
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };
console.log(startDate.replace(/\./g, '-'));

// 급이기 목록 가져오기
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

 
// 기간 변경 이벤트 핸들러
  const handlePeriodChange = (e) => {
    const period = e.target.value;
    setSelectedPeriod(period);

    if (period === '1개월') {
      const today = new Date();
      const oneMonthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
      setStartDate(formatDate(oneMonthAgo));
      setEndDate(formatDate(today));
    } else if (period === '3개월') {
      const today = new Date();
      const threeMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate());
      setStartDate(formatDate(threeMonthsAgo));
      setEndDate(formatDate(today));
    } else if (period === '6개월') {
      const today = new Date();
      const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 6, today.getDate());
      setStartDate(formatDate(sixMonthsAgo));
      setEndDate(formatDate(today));
    } else if (period === '전체') {
      setStartDate('');
      setEndDate('');
    }
  };

  // 날짜 형식 변환 함수
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  // 급이 내역 가져오기
  useEffect(() => {
    const today = new Date();
    setSelectedPeriod('전체');
    setStartDate(formatDate(today));
    setEndDate(formatDate(today));
  }, []);

  // 팝업 열기
  const handleOpenPopup = () => {
    setPopupOpen(true);
  };

  // 팝업 닫기
  const handleClosePopup = () => {
    setPopupOpen(false);
  };

  // 급이기 선택 이벤트 핸들러
  const handleFeeder = (event) => {
    const selectedValue = event.target.value;
  
    if (selectedValue === "") {
      // 전체를 선택한 경우
      setSelectedFeeders([]); // 선택된 값을 초기화합니다.
    } else {
      const selectedFeederId = parseInt(selectedValue);
      setSelectedFeeders((prevSelectedFeeders) => {
        if (prevSelectedFeeders.includes(selectedFeederId)) {
          // 이미 선택된 항목인 경우, 선택을 해제합니다.
          return prevSelectedFeeders.filter((id) => id !== selectedFeederId);
        } else {
          // 선택되지 않은 항목인 경우, 선택합니다.
          return [...prevSelectedFeeders, selectedFeederId];
        }
      });

      // id별로 정렬후 변수에 담습니다.
    }const feederInfoMap = {};
    feederlist.forEach((item) => {
      const feederId = item.feeder_info.id;
      if (feederInfoMap[feederId]) {
        feederInfoMap[feederId].push(item);
      } else {
        feederInfoMap[feederId] = [item];
      }
    });
    setFeederlist1(feederInfoMap[selectedValue[0]]);
    console.log(feederInfoMap[selectedValue[0]]);
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `http://intflowserver2.iptime.org:44480/feeder_log/list?start_date=${startDate.replace(/\./g, '-')}&end_date=${endDate.replace(/\./g, '-')}&sort=asc`;
        const response = await fetch(url);
        const jsonData = await response.json();
        setFeederlist(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [startDate, endDate]);

  
// 초기화 버튼 클릭 이벤트 핸들러
  const handleInitialization = () => {
    setSelectedPeriod('');
    setStartDate('');
    setEndDate('');
    setSelectedFeeders([]);
  };

  return (
    <div>
      <span className='abs'>급이내역</span>
      <button className='hand-input' onClick={handleOpenPopup}>수기 입력</button>
      {isPopupOpen && <Popup onClose={handleClosePopup} />}
      <p className='p'>기간 선택</p>
      <div className="select-container">
        <select value={selectedPeriod} onChange={handlePeriodChange}>
          <option value="전체">전체</option>
          <option value="1개월">1개월</option>
          <option value="3개월">3개월</option>
          <option value="6개월">6개월</option>
          <option value="직접입력">직접입력</option>
        </select>
        {selectedPeriod === '직접입력' ? (
          <div className="input-container">
            <input type="text" placeholder="YYYY-MM-DD" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <span> – </span>
            <input type="text" placeholder="YYYY-MM-DD" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        ) : (
          <div className="input-container">
            <input type="text" placeholder="YYYY-MM-DD" disabled value={startDate} />
            <span> – </span>
            <input type="text" placeholder="YYYY-MM-DD" disabled value={endDate} />
          </div>
        )}
        <select onClick={handleFeeder} >
        <option value="">전체</option>
          {feeder.map((item) => (
            <option key={item.id} value={item.id}>{item.name}</option>
          ))}
        </select>
        <button className='initialization' onClick={handleInitialization}>초기화</button>
      </div>

      <div>
      <span>총{feederlist1 && feederlist1.length > 0 ? feederlist1.length : 0}건</span>
    <div className="container">
      <span className="label">동사</span>
      <span className="label">동방</span>
      <span className="label">급이기 이름</span>
      <span className="label">급이량(kg)</span>
      <span className="label">
        급이일자{' '}
        <button onClick={handleSortOrderChange}>
          {sortOrder === 'asc' ? '최신순' : '과거순'}
        </button>
      </span>
    </div>
    {feederlist1 && feederlist1.length > 0 && (
      <table className="container">
        <tbody>
          {feederlist1
            .sort((a, b) => {
              // 정렬 순서에 따라 비교 함수 적용
              const dateA = new Date(a.created_datetime);
              const dateB = new Date(b.created_datetime);
              return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
            })
            .map((item) => (
              <tr key={item.id}>
                <td>{item.feeder_info.pen_info.piggery_info.name}</td>
                <td>{item.feeder_info.pen_info.name}</td>
                <td>{item.feeder_info.name}</td>
                <td>{item.amount} kg</td>
                <td>{item.created_datetime.split("T")[0]}</td>
              </tr>
            ))}
        </tbody>
      </table>
    )}
      </div>
    </div>
    

    
  );
}

export default History;
