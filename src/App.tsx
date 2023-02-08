import { useCallback, useMemo, useState } from 'react';
import { Steps, Button, Tooltip, message } from 'antd';
import data from './data/dishes.json';
import Step1 from './components/Step1';
import Step2 from './components/Step2';
import Step3 from './components/Step3';
import Review from './components/Review';
import './App.css';

const STEPS = [{ title: 'Step 1' }, { title: 'Step 2' }, { title: 'Step 3' }, { title: 'Review' }];

enum STEP {
  one,
  two,
  three,
  review,
}

export enum MEAL_CATEGORY {
  breakfast = 'breakfast',
  lunch = 'lunch',
  dinner = 'dinner',
}

export interface Dish {
  id: number | string;
  name?: string;
  count?: number;
}

function App() {
  const [current, setCurrent] = useState<STEP>(STEP.one);
  const [mealCategory, setMealCategory] = useState<MEAL_CATEGORY>();
  const [peopleNumber, setPeopleNumber] = useState(1);
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>();
  const [selectedDishes, setSelectedDishes] = useState<Array<Dish>>([]);
  const [formError, setFormError] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const nextReady = useMemo(() => {
    switch (current) {
      case STEP.one:
        if (!mealCategory || !peopleNumber) {
          return false;
        }
        break;
      case STEP.two:
        if (!selectedRestaurant) {
          return false;
        }
        break;
      case STEP.three:
        if (!selectedDishes.length || formError) return false;
        return selectedDishes.every(({ name }) => name);
      default:
        return true;
    }
    return true;
  }, [current, mealCategory, peopleNumber, selectedRestaurant, selectedDishes]);

  const restaurants = useMemo(() => {
    if (!mealCategory) return [];
    const redundantRestaurants = data.dishes
      .filter(({ availableMeals }) => availableMeals.includes(mealCategory))
      .map(({ restaurant }) => restaurant);
    return [...new Set(redundantRestaurants)].map((i) => ({
      label: i,
      value: i,
    }));
  }, [mealCategory]);

  const allDishes = useMemo(() => {
    if (!mealCategory) return [];
    const redundantDishes = data.dishes
      .filter(
        ({ restaurant, availableMeals }) =>
          restaurant === selectedRestaurant && availableMeals.includes(mealCategory)
      )
      .map(({ id, name }) => ({ id, name }));
    const set = new Set();
    return redundantDishes.filter(({ id }) => {
      if (!set.has(id)) {
        set.add(id);
        return true;
      }
      return false;
    });
  }, [mealCategory, selectedRestaurant]);

  const onNext = useCallback(() => {
    if (current !== STEP.review) {
      // next step
      setCurrent((pre) => pre + 1);
    } else {
      // submit
      console.log({
        meal: mealCategory,
        peopleNumber,
        restaurant: selectedRestaurant,
        dishes: selectedDishes,
      });

      messageApi.open({
        type: 'success',
        content: 'Success!',
      });
    }
  }, [current, mealCategory, peopleNumber, selectedRestaurant, selectedDishes]);

  const onPrevious = useCallback(() => {
    setCurrent((pre) => pre - 1);
  }, []);

  const currentForm = () => {
    let res;
    switch (current) {
      case STEP.one:
        res = (
          <Step1
            mealCategory={mealCategory}
            peopleNumber={peopleNumber}
            setMealCategory={setMealCategory}
            setPeopleNumber={setPeopleNumber}
          />
        );
        break;
      case STEP.two:
        res = (
          <Step2
            selectedRestaurant={selectedRestaurant}
            restaurants={restaurants}
            setSelectedRestaurant={setSelectedRestaurant}
          />
        );
        break;
      case STEP.three:
        res = (
          <Step3
            selectedRestaurant={selectedRestaurant}
            allDishes={allDishes}
            selectedDishes={selectedDishes}
            setSelectedDishes={setSelectedDishes}
            peopleNumber={peopleNumber}
            setFormError={setFormError}
            data={data}
          />
        );
        break;
      default:
        res = (
          <Review
            meal={mealCategory}
            peopleNumber={peopleNumber}
            restaurant={selectedRestaurant}
            dishes={selectedDishes}
          />
        );
    }
    return res;
  };

  return (
    <div className="container">
      {contextHolder}

      <div className="step-container">
        <Steps current={current} items={STEPS} />
      </div>

      <div className="form" style={{ display: 'flex', justifyContent: 'center' }}>
        <div>{currentForm()}</div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={onPrevious} style={{ visibility: current !== 0 ? undefined : 'hidden' }}>
          Previous
        </Button>

        <Tooltip title={nextReady ? '' : 'Please finish the form'}>
          <Button type="primary" disabled={!nextReady} onClick={onNext}>
            {current !== 3 ? 'Next' : 'Submit'}
          </Button>
        </Tooltip>
      </div>
    </div>
  );
}

export default App;
