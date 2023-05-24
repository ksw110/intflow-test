import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import './Graph.css';

const Graph = () => {
  const data = [];
  const [feeder, setFeeder] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedItems, setSelectedItems] = useState([]);
  const [showChart, setShowChart] = useState(false); 
  const [feederlist, setFeederlist] = useState([]);
  const [feederlist1, setFeederlist1] = useState([]);

  // 선택한 날짜의 첫째날과 마지막날 계산
  const dateValue = selectedDate;
  const year = dateValue.getFullYear();
  const month = dateValue.getMonth() + 1;
  const firstDay  = new Date(year, month - 1, 1);
  const lastDay  = new Date(year, month, 0);
  const firstDayFormatted = `${year}-${String(month).padStart(2, '0')}-01`;
  const lastDayFormatted = `${year}-${String(month).padStart(2, '0')}-${String(lastDay.getDate()).padStart(2, '0')}`;

  useEffect(() => {
    // 첫째날부터 마지막날까지의 급이 내역 데이터 가져오기
    const fetchData = async () => {
      try {
        const url = `http://intflowserver2.iptime.org:44480/feeder_log/list?start_date=${firstDayFormatted}&end_date=${lastDayFormatted}&sort=desc`;
        const response = await fetch(url);
        const jsonData = await response.json();
        setFeederlist(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [firstDayFormatted, lastDayFormatted]);

// 급이 내역 데이터를 급이기별로 그룹화
const groupedData = {};
feederlist.forEach((item) => {
  const feederId = item.feeder_info.id;
  if (!groupedData[feederId]) {
    groupedData[feederId] = [];
  }
  groupedData[feederId].push(item);
});




  useEffect(() => {
    // 선택한 급이기의 변경에 따라 차트 표시 여부 업데이트
    setShowChart(selectedItems.length > 0);
  }, [selectedItems]);
  useEffect(() => {
    // 급이기 목록 데이터 가져오기
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

  const handleDateChange = (e) => {
    // 선택한 날짜 변경 핸들러
    const selectedYear = e.target.value.slice(0, 4);
    const selectedMonth = e.target.value.slice(5, 7);
    setSelectedDate(new Date(selectedYear, selectedMonth - 1));
  };

  const handleCheckboxChange = (e, item) => {
    // 체크박스 변경 핸들러
    const checked = e.target.checked;
  
    if (checked) {
      // 급이기 선택 시 해당 급이기의 급이 내역 데이터를 저장하고 차트 표시
      setSelectedItems([item]);
      setFeederlist1(groupedData[item.id])
      
    console.log(groupedData);
    } else {
      // 급이기 선택 해제 시 선택 데이터 초기화
      setSelectedItems([]);
    }
    
  };

  const monthOptions = [];
  const currentMonth = selectedDate.getFullYear() === new Date().getFullYear() ? new Date().getMonth() + 1 : 12;
  for (let month = currentMonth; month >= 1; month--) {
    monthOptions.push(
      <option key={month} value={month}>
        {month}
      </option>
    );
  }

  const yearOptions = [];
  const currentYear = new Date().getFullYear();
  for (let year = currentYear; year >= currentYear - 10; year--) {
    yearOptions.push(
      <option key={year} value={year}>
        {year}
      </option>
    );
  }

  if (feederlist1) {
    // 선택한 급이기의 급이 내역 데이터를 차트 데이터로 변환
    for (let i = 1; i <= feederlist1.length; i++) {
      const name = String(i);
      const value = feederlist1[feederlist1.length - i]?.amount || 0;
    
      data.push({ name, value });
    }
  } else {
    
    
  }
  

  return (
    <div>
      <span className='text1'>일일 급여량 그래프</span>
      
      <select value={`${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}`} onChange={handleDateChange} className='data'>
        {yearOptions.map((year) =>
            monthOptions.map((month) => {
            const yearValue = parseInt(year.props.value);
            const monthValue = parseInt(month.props.value);
            const isSelected = yearValue === selectedDate.getFullYear() && monthValue === selectedDate.getMonth() + 1;
            return (
                <option key={`${yearValue}-${monthValue}`} value={`${yearValue}-${monthValue}`}>
                {`${yearValue}년 ${monthValue}월`}
                </option>
            );
            })
        )}
        </select>

      <div className="container">
      <div className="json-container">
        {feeder
            .sort((a, b) => a.name.localeCompare(b.name)) 
            .map((item) => (
            <label key={item.id} className={selectedItems.includes(item) ? 'checked' : ''}>
                <input
                type="checkbox"
                checked={selectedItems.includes(item)}
                onChange={(e) => handleCheckboxChange(e, item)}
                />
                {item.name.length > 8 ? `${item.name.slice(0, 8)}...` : item.name}
            </label>
            ))}
        </div>
        <div className="chart-container">
        {showChart ? (
          <BarChart width={1000} height={400} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        ) : (
          <>
          
            <div className="chart-placeholder">급이기를 선택해서 원하는 달에 얼마나 급이 됬는지 그래프로 확인해보세요.</div>
            
            <BarChart width={1000} height={400} data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
            </BarChart>
          </>
        )}
      </div>
    </div>
    </div>
  );
};

export default Graph;
