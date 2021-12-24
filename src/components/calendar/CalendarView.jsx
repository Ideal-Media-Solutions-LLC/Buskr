import Calendar from 'react-calendar';
import React from 'react';
import Link from 'next/link';
import { BsChevronRight, BsChevronLeft } from 'react-icons/bs';
import { searchLink } from '../../interface';

export default function CalendarView({ address, center, dates, search, time }) {
  const renderTile = function renderTile({ date: from }) {
    const link = searchLink({ address, center, from, search, sort: 'time' });
    return (
      <Link href={link} passHref={true}>
        <a>
          { dates.has(from.getTime()) ? <div className="notification" /> : null }
        </a>
      </Link>
    );
  };

  return (
    <div className="calendar-container">
      <Calendar
        value={time || new Date()}
        tileContent={renderTile}
        prevLabel={<BsChevronLeft />}
        nextLabel={<BsChevronRight />}
        next2Label={null}
        prev2Label={null}
        showNeighboringMonth={false}
      />
    </div>
  );
}
