# Angular State Management Comparison

A comprehensive comparison of 7 different Angular state management patterns, each implemented in its own application within a single Nx monorepo.

## 🎯 Patterns Covered

1. ✅ **Services with BehaviorSubject / Observables** - Traditional RxJS-based state management
2. ✅ **NgRx** - Redux-style reactive state management with actions, reducers, and effects
3. ✅ **Signals** - Angular reactive primitives with computed signals
4. ✅ **Akita** - Entity-based state management library with Store, Query, and Service
5. ✅ **Custom Event-based Store** - Event-driven state management with event sourcing pattern
6. ✅ **Component-local state** - State managed entirely within components using BehaviorSubjects
7. ✅ **NgRx Signals** - NgRx's signal-based state management using signalState and patchState

## ✨ Features

All applications implement the same feature set:

- ✅ Full CRUD operations with JSONPlaceholder API
- ✅ **Common pagination component** - Reusable across all apps
- ✅ **Skeleton loaders** - Table skeleton for all loading states
- ✅ Pagination, search, and filtering
- ✅ Loading and error states
- ✅ Toast notifications
- ✅ Dark/Light mode toggle
- ✅ Responsive UI (mobile, tablet, desktop)

## 🏗️ Architecture

### Monorepo Structure

```
angular-state-management-comparison/
├── apps/
│   ├── behavior-subject-app/
│   ├── ngrx-app/
│   ├── signals-app/
│   ├── akita-app/
│   ├── event-store-app/
│   ├── component-local-state-app/
│   └── ngrx-signals-app/
├── libs/
│   ├── ui/              # Reusable UI components
│   ├── tailwind-config/ # Shared Tailwind configuration
│   ├── services/        # API services
│   ├── utils/           # Helper functions
│   └── types/           # TypeScript types and interfaces
└── tools/               # Custom scripts and tools
```

### Shared Libraries

- **`libs/ui`** - Reusable UI components (buttons, cards, modals, tables, layout)
- **`libs/tailwind-config`** - Shared Tailwind CSS configuration
- **`libs/services`** - API calls and business logic
- **`libs/utils`** - Helper functions and utilities
- **`libs/types`** - TypeScript types and interfaces

## 🚀 Getting Started

### Prerequisites

- Node.js >= 20.19.0
- pnpm >= 8.0.0 (or npm)

### Installation

```bash
pnpm install
# or
npm install
```

### Development

Run a specific app:

```bash
# All 7 apps are fully implemented
pnpm nx serve behavior-subject-app
pnpm nx serve ngrx-app
pnpm nx serve signals-app
pnpm nx serve akita-app
pnpm nx serve event-store-app
pnpm nx serve component-local-state-app
pnpm nx serve ngrx-signals-app

# Or use Makefile
make serve-behavior-subject
make serve-ngrx
make serve-signals
make serve-akita
make serve-event-store
make serve-component-local
make serve-ngrx-signals
```

### Status

- ✅ **BehaviorSubject App** - Fully implemented
- ✅ **NgRx App** - Fully implemented
- ✅ **Signals App** - Fully implemented
- ✅ **Akita App** - Fully implemented
- ✅ **Event Store App** - Fully implemented
- ✅ **Component Local State App** - Fully implemented
- ✅ **NgRx Signals App** - Fully implemented

### Build

Build all apps:

```bash
pnpm nx build --all
```

Build a specific app:

```bash
pnpm nx build behavior-subject-app
```

### Docker

Build and run using Docker:

```bash
make docker-build
make docker-run
```

Or use Docker directly:

```bash
docker build -t angular-state-comparison .
docker run -p 4200:4200 angular-state-comparison
```

## 🛠️ Tech Stack

- **Angular 20** - Framework (latest stable)
- **Nx** - Monorepo tooling
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **RxJS** - Reactive programming
- **NgRx** - State management (for NgRx app)
- **NgRx Signals** - Signal-based state management (for NgRx Signals app)
- **Akita** - State management (for Akita app)
- **Signals** - Angular reactive primitives
- **JSONPlaceholder** - Mock API

## 📊 State Management Comparison

### When to Use Each Pattern

#### 1. **Services with BehaviorSubject / Observables** ⭐ Recommended for Most Apps

**Port:** `4200`  
**Best For:**

- Small to medium-sized applications
- Teams familiar with RxJS
- Applications requiring simple state management
- When you need fine-grained control over state updates

**Pros:**

- ✅ No external dependencies
- ✅ Full control over state logic
- ✅ Leverages Angular's built-in RxJS
- ✅ Easy to understand and debug
- ✅ Flexible and customizable
- ✅ Good performance with proper subscription management

**Cons:**

- ❌ More boilerplate for complex state
- ❌ Manual subscription management required
- ❌ No built-in devtools
- ❌ Can become complex with many services

**Use Case:** Most Angular applications, especially when starting a new project or when you need a simple, flexible solution.

---

#### 2. **NgRx** 🏢 Enterprise-Grade State Management

**Port:** `4201`  
**Best For:**

- Large, complex applications
- Teams requiring strict state management patterns
- Applications with complex async flows
- When you need time-travel debugging
- Enterprise applications with multiple developers

**Pros:**

- ✅ Predictable state updates (Redux pattern)
- ✅ Excellent devtools (Redux DevTools)
- ✅ Time-travel debugging
- ✅ Strong typing with TypeScript
- ✅ Side effects handled with Effects
- ✅ Great for large teams and complex apps
- ✅ Comprehensive ecosystem

**Cons:**

- ❌ Steep learning curve
- ❌ Significant boilerplate code
- ❌ Overkill for small applications
- ❌ Requires understanding of Redux patterns
- ❌ More verbose than other solutions

**Use Case:** Enterprise applications, large teams, complex state management requirements, when you need advanced debugging capabilities.

---

#### 3. **Signals** 🚀 Modern Angular Reactive Primitives

**Port:** `4202`  
**Best For:**

- New Angular 16+ applications (Signals introduced in Angular 16)
- Applications requiring fine-grained reactivity
- Performance-critical applications
- When you want to leverage Angular's latest features
- Applications with complex computed values

**Pros:**

- ✅ Built into Angular (no external dependencies)
- ✅ Fine-grained reactivity
- ✅ Excellent performance (no zone.js overhead)
- ✅ Simple, intuitive API
- ✅ Computed signals for derived state
- ✅ Future-proof (Angular's direction)
- ✅ Less boilerplate than NgRx

**Cons:**

- ❌ Requires Angular 16+ (Signals introduced in Angular 16)
- ❌ Newer API (less community resources)
- ❌ Limited ecosystem compared to NgRx
- ❌ May need to mix with RxJS for async operations

**Use Case:** New projects on Angular 16+, performance-critical applications, when you want to use Angular's latest reactive primitives.

---

#### 4. **Akita** 🎯 Simple Entity-Based State Management

**Port:** `4203`  
**Best For:**

- Applications with entity-based data (users, posts, products)
- Teams wanting NgRx-like features with less boilerplate
- Applications requiring caching and querying
- When you need a balance between simplicity and power

**Pros:**

- ✅ Less boilerplate than NgRx
- ✅ Entity management built-in
- ✅ Excellent TypeScript support
- ✅ Devtools support
- ✅ Simple, intuitive API
- ✅ Good performance
- ✅ Active query management

**Cons:**

- ❌ External dependency
- ❌ Smaller community than NgRx
- ❌ Less ecosystem support
- ❌ May be overkill for simple apps

**Use Case:** Applications with lots of entity data (CRUD operations), when you want NgRx-like features with less complexity, medium to large applications.

---

#### 5. **Custom Event-based Store** 🔧 Custom Solution

**Port:** `4204`  
**Best For:**

- Learning state management internals
- Custom requirements not met by existing solutions
- Applications needing event sourcing patterns
- When you want full control over state management

**Pros:**

- ✅ Complete control over implementation
- ✅ Can be tailored to specific needs
- ✅ No external dependencies
- ✅ Educational value
- ✅ Flexible architecture

**Cons:**

- ❌ Requires building and maintaining yourself
- ❌ No community support
- ❌ More time to implement
- ❌ Potential for bugs
- ❌ No built-in devtools

**Use Case:** Learning purposes, custom requirements, when existing solutions don't fit your needs, educational projects.

---

#### 6. **Component-local State** 📦 Simple Component State

**Port:** `4205`  
**Best For:**

- Small applications or features
- State that doesn't need to be shared
- Prototyping and quick development
- Simple forms and UI state
- When state is truly local to a component

**Pros:**

- ✅ Simple and straightforward
- ✅ No external dependencies
- ✅ Easy to understand
- ✅ Quick to implement
- ✅ Good for isolated features

**Cons:**

- ❌ Not suitable for shared state
- ❌ Can lead to prop drilling
- ❌ Difficult to scale
- ❌ No centralized state management
- ❌ Hard to debug across components

**Use Case:** Small features, prototypes, truly local component state, simple forms, when state doesn't need to be shared.

---

#### 7. **NgRx Signals** 🚀 NgRx's Signal-Based State Management

**Port:** `4206`  
**Best For:**

- Applications using NgRx ecosystem
- When you want NgRx features with signals
- Modern Angular applications (16+)
- Applications requiring fine-grained reactivity
- When you need NgRx patterns with signal-based state

**Pros:**

- ✅ Part of NgRx ecosystem
- ✅ Uses Angular signals for reactivity
- ✅ Less boilerplate than traditional NgRx
- ✅ Fine-grained reactivity
- ✅ Type-safe with TypeScript
- ✅ Familiar NgRx patterns (signalState, patchState)
- ✅ Good performance with signals
- ✅ Can integrate with NgRx Store if needed

**Cons:**

- ❌ Requires @ngrx/signals dependency
- ❌ Newer API (less community resources)
- ❌ Still part of NgRx ecosystem (some overhead)
- ❌ May need to mix with RxJS for async operations

**Use Case:** Applications already using or planning to use NgRx, when you want NgRx patterns with modern signal-based reactivity, modern Angular applications.

---

### 📈 Comparison Matrix

| Pattern | Complexity | Boilerplate | DevTools | Performance | Learning Curve | Best For |
|---------|-----------|-------------|----------|------------|----------------|----------|
| **BehaviorSubject** | Low-Medium | Low | ❌ | ⭐⭐⭐⭐ | Easy | Most apps |
| **NgRx** | High | High | ✅ | ⭐⭐⭐⭐ | Steep | Enterprise apps |
| **Signals** | Low-Medium | Low | ❌ | ⭐⭐⭐⭐⭐ | Easy-Medium | Modern apps |
| **Akita** | Medium | Medium | ✅ | ⭐⭐⭐⭐ | Medium | Entity-based apps |
| **Event Store** | High | Medium | ❌ | ⭐⭐⭐ | Medium-Hard | Custom needs |
| **Component Local** | Low | Low | ❌ | ⭐⭐⭐⭐ | Easy | Simple features |
| **NgRx Signals** | Low-Medium | Low-Medium | ❌ | ⭐⭐⭐⭐⭐ | Medium | NgRx ecosystem |

### 🎯 Quick Decision Guide

**Choose BehaviorSubject if:**

- You're building a small to medium app
- You want flexibility without external dependencies
- Your team is comfortable with RxJS

**Choose NgRx if:**

- You're building a large, complex application
- You need time-travel debugging
- You have a large team requiring strict patterns
- You need comprehensive state management

**Choose Signals if:**

- You're using Angular 16+
- Performance is critical
- You want to use Angular's latest features
- You prefer fine-grained reactivity

**Choose Akita if:**

- You have lots of entity-based data
- You want NgRx-like features with less boilerplate
- You need built-in entity management

**Choose Component Local if:**

- State is truly local to a component
- You're building a simple feature
- No state sharing is needed

**Choose NgRx Signals if:**

- You're using or planning to use NgRx
- You want NgRx patterns with signal-based reactivity
- You need fine-grained reactivity with NgRx ecosystem
- You're building modern Angular applications

**Choose Event Store if:**

- You have custom requirements
- You want to learn state management internals
- Existing solutions don't fit your needs

### 📚 Additional Resources

- [Angular Signals Documentation](https://angular.dev/guide/signals)
- [NgRx Documentation](https://ngrx.io/)
- [Akita Documentation](https://datorama.github.io/akita/)
- [RxJS Documentation](https://rxjs.dev/)

## 📝 Code Quality

- **ESLint** - Linting
- **Prettier** - Code formatting
- **Commitlint** - Commit message linting

## 📄 License

MIT
