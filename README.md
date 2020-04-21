# [JPConverter](https://zhiyongzou.github.io/JPConverter/)
JPConverter 是 OC 转 json patch 工具。首先在 Xcode 编写好对应的代码，然后将编译通过后的 OC 代码粘贴到 JPConverter。

如果在使用过程发现问题，欢迎来撩～

## 使用

### JPConverter 代码格式 
```objc
// 必须要用 @implementation Class 和 @end 包住目标方法
@implementation ViewController

- (void)viewDidLoad
{
  [super viewDidLoad];
}

@end
```

### OC方法除了 self, nil, YES, NO 外， 其他参数必须指定类型
```objc
// error
self.view.backgroundColor = [UIColor redColor];

// right
UIColor *redColor = [UIColor redColor];
self.view.backgroundColor = redColor;

// error
[self.view addSubview:[[UIView alloc] init]];

// right
UIView *aView = [[UIView alloc] init];
[self.view addSubview:aView];

// error
UIColor *blueColor = [UIColor colorWithRed:0 green:0 blue:1 alpha:1];

// right
CGFloat red = 0;
CGFloat green = 0;
CGFloat blue = 1;
CGFloat alpha = 1;
UIColor *blueColor = [UIColor colorWithRed:red green:green blue:blue alpha:alpha];

```

### if 语句
#### 禁止多级嵌套
```objc
// error
if (animated) {
  if (!animated) {
      
  }
}
```
#### 判断条件支持以下格式

```objc
if (hidden == NO) {
}

if (hidden) {
}

if (!animated) {
}

if (rows>0) {
}

if (view) {
}

if (view != nil) {
}
```

* 最多支持2层判断（待扩展）
```objc
// error
if (hidden && animated && isVisible) {
 
}

// right
if (hidden && animated) {
 
}
```
