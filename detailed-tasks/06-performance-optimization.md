# タスク6: パフォーマンス最適化

## 概要
アプリの応答性・メモリ使用量・バッテリー消費を改善し、ユーザー体験を向上させる。

## パフォーマンス分析

### 現在のパフォーマンス課題

#### 1. 初期ロード時間
- フォント読み込み待機時間
- Firebase初期化時間
- 大きなJavaScriptバンドルサイズ

#### 2. メモリ使用量
- 画像リソースの最適化不足
- 不要なコンポーネント再レンダリング
- メモリリーク可能性

#### 3. バッテリー消費
- カメラの連続使用（QRスキャナー）
- 不要なネットワーク通信
- CPU集約的な処理

## 最適化実装

### 1. コンポーネント最適化

#### 1.1 React.memo によるレンダリング最適化
```typescript
// src/components/basics/Button.tsx 最適化版
import React, { memo } from 'react';

type ButtonProps = {
  onPress?: () => void;
  text: string;
  type?: string;
  style?: ViewStyle;
  // ... 他のprops
};

const Button = memo<ButtonProps>((props) => {
  // ... 既存の実装
}, (prevProps, nextProps) => {
  // カスタム比較関数 - 必要な props のみ比較
  return (
    prevProps.text === nextProps.text &&
    prevProps.type === nextProps.type &&
    prevProps.onPress === nextProps.onPress
  );
});

export { Button };
```

#### 1.2 useMemo/useCallback の適切な使用
```typescript
// src/screens/event-list/EventList.tsx 最適化版
export const EventList = ({ navigation }: Props) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("最終更新日が新しい");

  // 検索・ソート結果をメモ化
  const filteredAndSortedEvents = useMemo(() => {
    let filtered = events.filter(event => 
      event.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      switch (sortOption) {
        case "最終更新日が新しい":
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case "イベント名順":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  }, [events, searchTerm, sortOption]);

  // イベント選択ハンドラーをメモ化
  const handleEventSelect = useCallback((eventId: string) => {
    const selectedEvent = events.find(e => e.id === eventId);
    if (selectedEvent) {
      navigation.navigate('SelectReceptionMethod', { 
        eventId: selectedEvent.id,
        eventName: selectedEvent.name 
      });
    }
  }, [events, navigation]);

  // デバウンス検索
  const debouncedSearch = useMemo(
    () => debounce((term: string) => {
      setSearchTerm(term);
    }, 300),
    []
  );

  // ... 残りの実装
};
```

#### 1.3 FlatList の最適化
```typescript
// イベントリストの仮想化対応
const EventListComponent = memo(() => {
  const renderEventItem = useCallback(({ item }: { item: Event }) => (
    <EventItem 
      event={item} 
      onPress={() => handleEventSelect(item.id)} 
    />
  ), [handleEventSelect]);

  const getItemLayout = useCallback((data: any, index: number) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  }), []);

  const keyExtractor = useCallback((item: Event) => item.id, []);

  return (
    <FlatList
      data={filteredAndSortedEvents}
      renderItem={renderEventItem}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      windowSize={10}
      initialNumToRender={8}
      // Android でのパフォーマンス向上
      {...(Platform.OS === 'android' && {
        getItemLayout: undefined, // Android では無効化
      })}
    />
  );
});

const ITEM_HEIGHT = 80; // 固定高さの場合
```

### 2. 画像・リソース最適化

#### 2.1 画像の遅延ローディング
```typescript
// src/components/OptimizedImage.tsx
import React, { useState, memo } from 'react';
import { Image, View, ActivityIndicator } from 'react-native';

interface OptimizedImageProps {
  source: { uri: string };
  style?: any;
  placeholder?: React.ReactNode;
}

const OptimizedImage = memo<OptimizedImageProps>(({ source, style, placeholder }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoadStart = () => setIsLoading(true);
  const handleLoadEnd = () => setIsLoading(false);
  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  if (hasError) {
    return (
      <View style={[style, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>画像を読み込めませんでした</Text>
      </View>
    );
  }

  return (
    <View style={style}>
      <Image
        source={source}
        style={style}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
        resizeMode="cover"
      />
      {isLoading && (
        <View style={[style, { position: 'absolute', justifyContent: 'center', alignItems: 'center' }]}>
          {placeholder || <ActivityIndicator size="small" />}
        </View>
      )}
    </View>
  );
});

export { OptimizedImage };
```

#### 2.2 フォント最適化
```typescript
// App.tsx フォント読み込み最適化
export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      try {
        // フォントを並列で読み込み
        await Promise.all([
          Font.loadAsync({
            SpaceMono: require("./src/assets/fonts/SpaceMono-Regular.ttf"),
          }),
          Font.loadAsync({
            HiraginoKaku_GothicPro_Text: require("./src/assets/fonts/Hiragino-Kaku-Gothic-Pro-W3.otf"),
            HiraginoKaku_GothicPro_Text_Bold: require("./src/assets/fonts/Hiragino-Kaku-Gothic-Pro-W6.ttf"),
          })
        ]);
        
        setFontLoaded(true);
      } catch (error) {
        console.error('フォント読み込みエラー:', error);
        // フォント読み込み失敗時もアプリを起動
        setFontLoaded(true);
      }
    };

    loadFonts();
  }, []);

  // フォント読み込み中の軽量なローディング画面
  if (!fontLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>アプリを準備中...</Text>
      </View>
    );
  }

  // ... 残りの実装
}
```

### 3. ネットワーク最適化

#### 3.1 APIリクエストの最適化
```typescript
// src/services/ApiService.ts
export class ApiService {
  private static cache = new Map<string, { data: any; timestamp: number }>();
  private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5分

  // キャッシュ機能付きAPIリクエスト
  static async fetchWithCache<T>(
    url: string, 
    options?: RequestInit
  ): Promise<T> {
    const cacheKey = `${url}_${JSON.stringify(options)}`;
    const cached = this.cache.get(cacheKey);
    
    // キャッシュが有効な場合は返す
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // 結果をキャッシュ
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // 複数リクエストの並列処理
  static async fetchMultiple<T>(requests: Array<() => Promise<T>>): Promise<T[]> {
    return Promise.all(requests.map(req => req()));
  }

  // キャッシュクリア
  static clearCache(): void {
    this.cache.clear();
  }

  // 期限切れキャッシュの削除
  static cleanExpiredCache(): void {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp >= this.CACHE_DURATION) {
        this.cache.delete(key);
      }
    }
  }
}
```

#### 3.2 Firebase最適化
```typescript
// src/config/firebaseConfig.ts 最適化版
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getDatabase, connectDatabaseEmulator } from 'firebase/database';

// Firebase設定の遅延初期化
let firebaseApp: any = null;
let userAuth: any = null;
let realtimeDB: any = null;

const getFirebaseApp = () => {
  if (!firebaseApp) {
    firebaseApp = initializeApp({
      // ... 設定
    });
  }
  return firebaseApp;
};

const getUserAuth = () => {
  if (!userAuth) {
    userAuth = getAuth(getFirebaseApp());
    
    // 開発環境でのエミュレーター接続
    if (__DEV__ && !userAuth._delegate._config.emulator) {
      connectAuthEmulator(userAuth, 'http://localhost:9099');
    }
  }
  return userAuth;
};

const getRealtimeDB = () => {
  if (!realtimeDB) {
    realtimeDB = getDatabase(getFirebaseApp());
    
    // 開発環境でのエミュレーター接続
    if (__DEV__ && !realtimeDB._delegate._repoInternal?.repoInfo_?.host.includes('localhost')) {
      connectDatabaseEmulator(realtimeDB, 'localhost', 9000);
    }
  }
  return realtimeDB;
};

export { getUserAuth as userAuth, getRealtimeDB as realtimeDB };
```

### 4. メモリ管理最適化

#### 4.1 useEffect クリーンアップ
```typescript
// 適切なクリーンアップの実装例
export const QRScanner = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    // カメラ権限の取得
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();

    // タイマーの設定
    const timer = setInterval(() => {
      // 定期的な処理
    }, 1000);

    // イベントリスナーの設定
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // クリーンアップ関数
    return () => {
      clearInterval(timer);
      subscription?.remove();
    };
  }, []);

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === 'background') {
      // バックグラウンド時の処理停止
      setScanned(true);
    }
  };

  // ... 残りの実装
};
```

#### 4.2 大きなデータセットの処理
```typescript
// ページネーション付きデータ管理
export const useEventList = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadEvents = useCallback(async (pageNumber: number = 1, reset: boolean = false) => {
    if (loading) return;

    setLoading(true);
    try {
      const newEvents = await ApiService.fetchEvents(pageNumber, 20); // 20件ずつ取得
      
      setEvents(prevEvents => 
        reset ? newEvents : [...prevEvents, ...newEvents]
      );
      
      setHasMore(newEvents.length === 20);
      setPage(pageNumber);
    } catch (error) {
      console.error('イベント取得エラー:', error);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      loadEvents(page + 1, false);
    }
  }, [hasMore, loading, page, loadEvents]);

  const refresh = useCallback(() => {
    loadEvents(1, true);
  }, [loadEvents]);

  return {
    events,
    loading,
    hasMore,
    loadMore,
    refresh,
  };
};
```

### 5. バンドルサイズ最適化

#### 5.1 不要な依存関係の削除
```bash
# 未使用パッケージの検出
npx depcheck

# バンドルサイズ分析
npx expo install @expo/webpack-config
npx webpack-bundle-analyzer
```

#### 5.2 コード分割
```typescript
// 画面コンポーネントの遅延ローディング
import React, { lazy, Suspense } from 'react';

// 遅延ローディング対象画面
const EventList = lazy(() => import('./src/screens/event-list/EventList'));
const CheckIn = lazy(() => import('./src/screens/check-in/CheckIn'));
const QRScanner = lazy(() => import('./src/screens/selfqr-scanner/SelfqrScanner'));

// ローディングコンポーネント
const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" />
    <Text>画面を読み込み中...</Text>
  </View>
);

// Navigation での使用
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen 
          name="EventList" 
          component={() => (
            <Suspense fallback={<LoadingScreen />}>
              <EventList />
            </Suspense>
          )} 
        />
        {/* 他の画面も同様に */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

## パフォーマンス測定

### 1. メトリクス設定
```typescript
// src/utils/PerformanceMonitor.ts
export class PerformanceMonitor {
  private static measurements = new Map<string, number>();

  static startMeasure(name: string): void {
    this.measurements.set(name, Date.now());
  }

  static endMeasure(name: string): number {
    const startTime = this.measurements.get(name);
    if (!startTime) {
      console.warn(`測定開始されていません: ${name}`);
      return 0;
    }

    const duration = Date.now() - startTime;
    this.measurements.delete(name);

    if (__DEV__) {
      console.log(`⏱️ ${name}: ${duration}ms`);
    }

    return duration;
  }

  // メモリ使用量監視（開発環境のみ）
  static logMemoryUsage(label: string = ''): void {
    if (__DEV__ && global.performance && global.performance.memory) {
      const memory = global.performance.memory;
      console.log(`🧠 Memory ${label}:`, {
        used: `${Math.round(memory.usedJSHeapSize / 1024 / 1024)}MB`,
        total: `${Math.round(memory.totalJSHeapSize / 1024 / 1024)}MB`,
        limit: `${Math.round(memory.jsHeapSizeLimit / 1024 / 1024)}MB`,
      });
    }
  }
}
```

### 2. 実装例
```typescript
// パフォーマンス測定の使用例
export const EventList = ({ navigation }: Props) => {
  useEffect(() => {
    PerformanceMonitor.startMeasure('EventList_Load');
    PerformanceMonitor.logMemoryUsage('EventList_Start');

    loadEvents().then(() => {
      PerformanceMonitor.endMeasure('EventList_Load');
      PerformanceMonitor.logMemoryUsage('EventList_End');
    });

    return () => {
      PerformanceMonitor.logMemoryUsage('EventList_Cleanup');
    };
  }, []);

  // ... 残りの実装
};
```

## 実装スケジュール

### Phase 1: コンポーネント最適化 (2日)
- React.memo, useMemo, useCallback の適用
- FlatList最適化

### Phase 2: リソース最適化 (2日)  
- 画像・フォント最適化
- バンドルサイズ削減

### Phase 3: ネットワーク・メモリ最適化 (1日)
- API キャッシュ実装
- メモリリーク修正

## 成功指標
- [ ] 初期ロード時間: 3秒以内
- [ ] メモリ使用量: 100MB以下
- [ ] バンドルサイズ: 20%削減
- [ ] FPS: 60fps維持
- [ ] アプリサイズ: 30MB以下

## 所要時間
約5日

## 測定ツール
- Flipper でのパフォーマンス監視
- Metro bundler の分析
- React Native Performance Monitor