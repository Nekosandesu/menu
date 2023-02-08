import { useMemo } from 'react';
import { Space } from 'antd';
import { Dish, MEAL_CATEGORY } from '../App';

interface ReviewProps {
  meal: MEAL_CATEGORY | undefined;
  peopleNumber: number;
  restaurant: string | undefined;
  dishes: Array<Dish>;
}
export default function Review({ meal, peopleNumber, restaurant, dishes }: ReviewProps) {
  const results = useMemo(() => {
    return [
      {
        label: 'Meal',
        value: meal,
      },
      {
        label: 'No. of. People',
        value: peopleNumber,
      },
      {
        label: 'Restaurant',
        value: restaurant,
      },
      {
        label: 'Dishes',
        value: (
          <div style={{ border: '2px solid #111', padding: 12 }}>
            {dishes.map(({ name, count }) => (
              <div
                key={name}
                style={{
                  marginBottom: 12,
                  display: 'flex',
                  flexWrap: 'nowrap',
                }}
              >
                <Space>
                  <div>{name}</div>-<div>{count}</div>
                </Space>
              </div>
            ))}
          </div>
        ),
      },
    ];
  }, []);

  return (
    <>
      {results.map(({ label, value }) => (
        <div key={label} className="form-item two-column">
          <div className="form-item-left">{label}</div>
          <div>{value}</div>
        </div>
      ))}
    </>
  );
}
