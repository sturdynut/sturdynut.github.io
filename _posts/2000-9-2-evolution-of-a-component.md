---
disqus: http://sturdynut.com/blog/evolution-of-a-component.html
layout: post
background: "37.jpg"
title: "Evolution of a Component"
author: Matti Salokangas
comments: true
tags:
  - react
  - components

---

React components can be created in a variety of ways.  Each has a particular usefulness and one can lead to the next.  Usually starting as a single file like `Alerts.js` and eventually being broken down into multiple components in an `Alerts` folder when it becomes large and scary.

Eventually it could be used by other components, so it will need to be put somewhere it makes sense to be accessed by other components.  Maybe it will eventually be needed across multiple projects.

This evolution of a component is interesting.

# It all started with File 🔥

It really all starts with a single file.  As an example let's consider a component that will listen for new alerts and when there is one display it.  We shall name it `Alerts.js`.

Looking at an example implementation below, we can see how we have several hooks, a helper function and a looping JSX structure.  To be fair, the example below really isn't too large or complex, it is just going to serve as an "ok" example for now.  In a real life application there will likely be much more going on.

```
// Contents of 'Alerts.js'

...
const Alerts = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const unsubscribe = eventEmitter.addListener(
      ACTIONS.ADD,
      alert => {
        setAlerts([
          alert,
          ...alerts
        ]);
      }
    );

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = eventEmitter.addListener(
      ACTIONS.CLEAR,
      () => {
        setAlerts([]);
      }
    );

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = eventEmitter.addListener(
      ACTIONS.CLEAR_ONE,
      (id) => {
        setAlerts(alert.filter(alert => alert.id !== id));
      }
    );

    return unsubscribe;
  }, []);

  const clearOne = (id) => {
    eventEmitter.dispatch(ACTIONS.CLEAR_ONE, id)
  }

  const clearAll = () => {
    eventEmitter.dispatch(ACTIONS.CLEAR_ALL)
  }

	const getColor = (alertType) => {
		switch (alertType) {
			case ALERT_TYPES.ERROR:
				return COLORS.RED;
			case ALERT_TYPES.WARNING:
				return COLORS.YELLOW;
			case ALERT_TYPES.INFO:
				return COLORS.BLUE;
		}

		return COLORS.BLACK;
	}

	const formatTitle = (title) => {
		return title.toUpperCase();
	}

  return (
    <div>
      {alerts.map(alert => (
        <div key={alert.id}>
          <div style={{color: getColor(alert.type); }}>{formatTitle(alert.title)}</div>
          <button onClick={() => clearOne(alert.id)}>Clear</button>
        </div>
      ))}
      <button onClick={() => clearAll()}>Clear All</button>
    </div>
  )
}
```

# When it gets big and scary 👹

Usually, this happens when components start getting more than 200 lines of code.  Honestly, it is best to avoid big and scary components by being proactive about extractions and avoiding the problem in the first place.

## Where are the extractions?

- New components from complex JSX
- New hooks to handle complexity from the existing hooks
- Extraction of helper functions to other files

By extracting new components, hooks and helper functions it should greatly reduce the lines of code, cognitive complexity and code that is easier to reason about.

Looking back at our `Alerts.js` component, here is an example of what the component could look like after extractions.

```
const Alerts = () => {
  const {alerts} = useAlerts(eventEmitter);

  const clearOne = (id) => {
    eventEmitter.dispatch(ACTIONS.CLEAR_ONE, id)
  }

  const clearAll = () => {
    eventEmitter.dispatch(ACTIONS.CLEAR_ALL)
  }

  return (
    <div>
      {alerts.map(alert => (
        <Alert key={alert.id} alert={alert} />
      ))}
      <AlertActions onClearAll={clearAll} />
    </div>
  )
}
```

It is a lot easier to take this component in.  We see clear boundaries and responsibilities.  Complexity has been isolated, which makes it easier to process and reason about.

That code had to go somewhere, so we do in fact have quite a few more files.  Let's take a peak.

### File Changes

__Before__
```
src/
  /components
    Alerts.js (76 lines of code)
```

__After__
```
src/
  /components
    /Alerts
      Alerts.js (20 lines of code)
      Alert.js
      AlertActions.js
      index.js
      useAlerts.js
      utils.js
```

# When other components need it 👨‍👧‍👦

This seems obvious.  It is in `src/components`, so you would just import from there to the places you need it.  That is correct!  Easy as pie 🥧

```
import { Alerts } from 'components/Alerts'

export const Page = () => {
  ...

  return (
    <Alerts />
    ...
  )
}
```

This can work at first, but over time as an app grows the root components tree can become huge and it can start to become hard to figure out what is what.  At some point it just makes sense to start grouping related things.

## Grouping related things

This allows us to create boundaries around things that are related.

To have a specific place for these groupings, we should have a folder.  Let's use "modules" for now.  Looking at the example below you can see we have a `messaging` module and a `reporting` module.  Note that we still have the root level `components` folder.

```
src/
  /components
  /modules
    /messaging
      /components
        Alerts.js
    /reporting
```

The `messaging` module is where the `Alerts.js` component lives because the developers building the messaging module needed it for the messaging features.

### What happens when the reporting module wants Alerts.js?

Similar to how we lift state up in React, this is where we lift components up.

When there is a need for the `Alerts.js` module elsewhere, we simply lift it up to the root level components folder.

```
src/
  /components
    Alerts.js
  /modules
    /messaging // imports Alerts.js
    /reporting // imports Alerts.js
```

Now the messaging and reporting modules can both import the `Alerts.js` component and both modules are free of importing from one another.

Arguably, `Alerts.js` could stay right where it is and the `reporting` module could import from the `messaging` module.

#### Why is importing between modules bad?

It's not great to have modules depend on one another to work (Cyclic dependencies!).  It is helpful to consider a module as something that could be extracted to its own repo relatively easy.

# When other projects need it 👨‍👧‍👦👨‍👧‍👦👨‍👧‍👦

When a component becomes needed across projects whether it is in the root component tree or in a module, it should be extracted to another repo where it can be imported into both.

## Monorepo

Monorepo's like [lerna](https://lerna.js.org/) are a great tool for this kind of setup, which allows you to publish your packages as well as dev locally.

Below is an example of how a monorepo could be setup to have shared components across projects.

```
src/
  /packages
    /common-ui // Alert.js lives here
    /app-1 // Uses Alert.js from common-ui
    /app-2 // Uses Alert.js from common-ui
```

### Storybook

Lastly, it can be nice to setup [Storybook](https://storybook.js.org/) in your shared ui package as documentation for other dev teams.  This can showcase all the available components, hooks or even just general patterns.
