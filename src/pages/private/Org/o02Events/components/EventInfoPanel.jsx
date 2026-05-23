import { CalendarDays, MapPin, Info, CheckCircle } from 'lucide-react';
import { formatDistanceValue } from '../../../../../utils/eventUtils';

const EventInfoPanel = ({ title, description, date, distance, location }) => {
  const d = description;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl leading-tight font-bold text-gray-900 sm:text-2xl lg:text-3xl">
        {title}
      </h1>

      <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
        <Info size={16} className="shrink-0 text-green-500" />
        About This Experience
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-sm leading-relaxed text-gray-600">{d.headline}</p>

        <ul className="flex flex-col gap-1.5">
          {d.bullets1.map((b) => (
            <li key={b} className="flex items-start gap-2">
              <CheckCircle size={15} className="mt-1 shrink-0 text-green-500" />
              <span className="text-sm leading-relaxed text-gray-600">{b}</span>
            </li>
          ))}
        </ul>

        <p className="text-sm leading-relaxed text-gray-600">{d.body}</p>

        <ul className="flex flex-col gap-1.5">
          {d.bullets2.map((b) => (
            <li key={b} className="flex items-start gap-2">
              <CheckCircle size={15} className="mt-1 shrink-0 text-green-500" />
              <span className="text-sm leading-relaxed text-gray-600">{b}</span>
            </li>
          ))}
        </ul>

        <p className="font-medium text-gray-800">{d.tagline}</p>
      </div>

      {/* Meta */}
      <div className="mt-1 flex flex-col gap-3 border-t border-gray-100 pt-4 text-sm text-gray-700">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex items-start gap-2">
            <CalendarDays size={15} className="mt-1.5 shrink-0 text-green-500" />
            <div>
              <p className="font-semibold text-gray-800">Date &amp; Time:</p>
              <p className="text-gray-600">{date}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <MapPin size={15} className="mt-1.5 shrink-0 text-green-500" />
            <div>
              <p className="font-semibold text-gray-800">Distance</p>
              <p className="text-gray-600">{formatDistanceValue(distance)}</p>
            </div>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <MapPin size={15} className="mt-1.5 shrink-0 text-green-500" />
          <div>
            <p className="font-semibold text-gray-800">Location</p>
            <p className="text-gray-600">{location}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventInfoPanel;
