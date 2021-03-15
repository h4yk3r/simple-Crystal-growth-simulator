function CrystalGrowth(row, col, prodis, proapp, pro1, pro2) {
    this.row = row;
    this.col = col;
    this.sss = row*col;
    this.grid = [];
    this.atomNumber = 0;
    this.nextatomNumber = 0;
    this.period = 1;
    this.pro_dis = prodis;
    this.pro_app = proapp;
    this.pro_abovefive = pro1;
    this.pro_three = pro2;
}

//初始化界面，开始的时候界面上一个原子都没有
CrystalGrowth.prototype.initRandom = function() {
    this.atomNumber = 0;
    this.period = 1;
    for(var i=0;i<this.row;i++) {
        this.grid[i] = [];
        for(var j=0;j<this.col;j++) {
            this.grid[i][j] = {'state':0, 'nextState':0};
            this.nextatomNumber = this.atomNumber;
        }
    }
};

//计算一个格子周围已经被原子占据的格子个数
CrystalGrowth.prototype.aliveCountAround = function(x,y) {//计算周围八个位置现在状态为1的格子个数，其中格子是无限的，边界格被扩展到另一侧
    return this.grid[this.mapX(x-1)][this.mapY(y-1)].state + //左上
            this.grid[this.mapX(x-1)][y].state + //左一
            this.grid[this.mapX(x-1)][this.mapY(y+1)].state + //左下
            this.grid[x][this.mapY(y-1)].state + //上一
            this.grid[x][this.mapY(y+1)].state + //下一
            this.grid[this.mapX(x+1)][this.mapY(y-1)].state + //右上
            this.grid[this.mapX(x+1)][y].state + //右一
            this.grid[this.mapX(x+1)][this.mapY(y+1)].state;//右下
};

//左右边界的映射，超出左边界则认为是右边界关联，如-1会映射为是最右侧,这样会让游戏的宽度是无限延展的
CrystalGrowth.prototype.mapX = function(x) {
    return (x >= this.row || x < 0 ) ? (x%this.row + this.row) % this.row : x;
};

//上下边界的映射，参见mapX
CrystalGrowth.prototype.mapY = function(y) {
    return (y >= this.col || y < 0 ) ? (y%this.col + this.col) % this.col: y;
};

//计算一个格子下一周期的状态转换概率
CrystalGrowth.prototype.shiftProbability = function(x,y) {
    var aliveCountAround = this.aliveCountAround(x,y);//计算周围八个格子当中非空格子的个数
    if (this.grid[x][y].state === 1) {//原本有原子占用
        var pdisappear = this.pro_dis;//一个孤立的原子消失的概率
        if (aliveCountAround === 8 || aliveCountAround === 7) {
            pdisappear = 0;//周边都有原子则不会消失
        }
        return pdisappear;
    } else if (this.grid[x][y].state === 0) {//原本是个空格子
        var pappear = this.pro_app;//一个空格子被原子占据的概率
        if (aliveCountAround === 3) {//周围有3个原子时空格子被原子占据的概率
            pappear = this.pro_three;
        } else if (aliveCountAround === 5) {//周围有5个以上原子时空格子被原子占据的概率
            pappear = this.pro_abovefive;
        } else if (aliveCountAround === 6) {//周围有5个以上原子时空格子被原子占据的概率
            pappear = this.pro_abovefive;
        } else if (aliveCountAround === 7) {//周围有5个以上原子时空格子被原子占据的概率
            pappear = this.pro_abovefive;
        } else if (aliveCountAround === 8) {//周围有5个以上原子时空格子被原子占据的概率
            pappear = this.pro_abovefive;
        }

        return pappear;
    }
}


//根据格子的状态转换概率计算格子下一周期的状态
CrystalGrowth.prototype.nextState = function(x,y) {
    var p = this.shiftProbability(x,y);
    if (this.grid[x][y].state === 1) {//对已经有原子占据的格子，对消失的概率进行判定
        if (p === 0) {//如果原子消失的概率为0，则原子不消失，下一周期状态还是1
            return 1;
        }else if (Math.random() <= p) {//如果随机数小于概率，则判定为事件发生，即这个原子消失
            return 0;
        }else {
            return 1;
        }
    } else if (this.grid[x][y].state === 0) {//对空格子，对出现原子的概率进行判定
        if (Math.random() <= p) {//如果随机数小于概率，则判定为事件发生，即这个格子出现一个新原子
            return 1;
        } else {
            return 0;
        }
    }
}

//计算所有格子下一周期的状态
CrystalGrowth.prototype.calcNextState = function() {
    this.nextatomNumber = 0;
    for(var i=0;i<this.row;i++) {
        for(var j=0;j<this.col;j++) {
            this.grid[i][j].nextState = this.nextState(i, j);
            if (this.grid[i][j].nextState === 1) {
                this.nextatomNumber++;
            }
                
        }
    }
};

//将所有格子转换到下一周期
CrystalGrowth.prototype.changeNextState = function() {
  for(var i=0;i<this.row;i++) {
      for(var j=0;j<this.col;j++) {
          this.grid[i][j].state = this.grid[i][j].nextState;
      }
  }
  this.atomNumber = this.nextatomNumber;
  this.period++;
};

//下一周期
CrystalGrowth.prototype.nextAround = function() {
    this.calcNextState();
    this.changeNextState();
};

//是否有原子
CrystalGrowth.prototype.isAlive = function(x,y) {
    return this.grid[x][y].state === 1;
};
