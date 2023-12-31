import gsap from "gsap";

import { Base } from "game/base";
import { Fighter, FighterProps } from "game/fighter";
import { Sprite } from "game/sprite";
import { Colour, Direction, defaultCanvasHeight, defaultCanvasWidth, defaultTimer, enemyKeyBindings, playerKeyBindings } from "utils";

export class Engine extends Base {
    private animationRequestId: number;

    private getAnimationRequestId = (): number => this.animationRequestId;

    private setAnimationRequestId = (animationRequestId: number): void => {
        this.animationRequestId = animationRequestId;
    };

    private timer: number = defaultTimer;

    public getTimer = (): number => this.timer;

    private setTimer = (timer: number): void => {
        this.timer = timer;
    };

    private gameTimeout: ReturnType<typeof setTimeout>;

    public getGameTimeout = (): ReturnType<typeof setTimeout> => this.gameTimeout;

    private setGameTimeout = (gameTimeout: ReturnType<typeof setTimeout>): void => {
        this.gameTimeout = gameTimeout;
    };

    private background: Sprite;

    public getBackground = (): Sprite => this.background;

    private setBackground = (background: Sprite): void => {
        this.background = background;
    };
    
    private shop: Sprite;

    public getShop = (): Sprite => this.shop;

    private setShop = (shop: Sprite): void => {
        this.shop = shop;
    };
    
    private player: Fighter;

    public getPlayer = (): Fighter => this.player;

    private setPlayer = (player: Fighter): void => {
        this.player = player;
    };
    
    private enemy: Fighter;

    public getEnemy = (): Fighter => this.enemy;

    private setEnemy = (enemy: Fighter): void => {
        this.enemy = enemy;
    };

    constructor() {
        super();
        this.setCanvasSize();
        this.decreaseTimer();
        this.bindListeners();
        console.log('Engine loaded');
    };

    private draw = (): void => {
        const background: Sprite = new Sprite({
            position: { x: 0, y: 0 },
            imageSrc: 'assets/img/background.png',
        });
        this.setBackground(background);
        
        const shop: Sprite = new Sprite({
            position: { x: 600, y: 128 },
            imageSrc: 'assets/img/shop.png',
            scale: 2.75,
            totalFrames: 6, // from image
        });
        this.setShop(shop);
        
        const player: Fighter = this.createFighter({
            position: { x: defaultCanvasWidth / 4, y: 0 },
            velocity: { x: 0, y: 0 },
            keyBindings: playerKeyBindings,
            directionFaced: Direction.Right,
            attackBoxDimensions: {
                offset: { x: 70, y: 0 },
                width: 150,
                height: 80,
            },
            sprites: {
                idle: {
                    imageSrc: 'assets/img/samurai-mack/idle.png',
                    flippedImageSrc: 'assets/img/samurai-mack/idle-flipped.png',
                    totalFrames: 8,
                },
                attack: {
                    imageSrc: 'assets/img/samurai-mack/attack-1.png',
                    flippedImageSrc: 'assets/img/samurai-mack/attack-1-flipped.png',
                    totalFrames: 6,
                },
                jump: {
                    imageSrc: 'assets/img/samurai-mack/jump.png',
                    flippedImageSrc: 'assets/img/samurai-mack/jump-flipped.png',
                    totalFrames: 2,
                },
                fall: {
                    imageSrc: 'assets/img/samurai-mack/fall.png',
                    flippedImageSrc: 'assets/img/samurai-mack/fall-flipped.png',
                    totalFrames: 2,
                },
                run: {
                    imageSrc: 'assets/img/samurai-mack/run.png',
                    flippedImageSrc: 'assets/img/samurai-mack/run-flipped.png',
                    totalFrames: 8,
                },
                takeHit: {
                    imageSrc: 'assets/img/samurai-mack/take-hit-white-silhouette.png',
                    flippedImageSrc: 'assets/img/samurai-mack/take-hit-white-silhouette-flipped.png',
                    totalFrames: 4,
                },
                die: {
                    imageSrc: 'assets/img/samurai-mack/death.png',
                    flippedImageSrc: 'assets/img/samurai-mack/death-flipped.png',
                    totalFrames: 6,
                },
            },
            scale: 2.5,
            offset: { x: 215, y: 157 },
        });
        this.setPlayer(player);
        
        const enemy: Fighter = this.createFighter({
            position: { x: (defaultCanvasWidth / 4) * 3, y: 0 },
            velocity: { x: 0, y: 0 },
            keyBindings: enemyKeyBindings,
            directionFaced: Direction.Left,
            attackBoxDimensions: {
                offset: { x: 50, y: 0 },
                width: 150,
                height: 80,
            },
            sprites: {
                idle: {
                    imageSrc: 'assets/img/kenji/idle.png',
                    flippedImageSrc: 'assets/img/kenji/idle-flipped.png',
                    totalFrames: 4,
                },
                attack: {
                    imageSrc: 'assets/img/kenji/attack-1.png',
                    flippedImageSrc: 'assets/img/kenji/attack-1-flipped.png',
                    totalFrames: 4,
                },
                jump: {
                    imageSrc: 'assets/img/kenji/jump.png',
                    flippedImageSrc: 'assets/img/kenji/jump-flipped.png',
                    totalFrames: 2,
                },
                fall: {
                    imageSrc: 'assets/img/kenji/fall.png',
                    flippedImageSrc: 'assets/img/kenji/fall-flipped.png',
                    totalFrames: 2,
                },
                run: {
                    imageSrc: 'assets/img/kenji/run.png',
                    flippedImageSrc: 'assets/img/kenji/run-flipped.png',
                    totalFrames: 8,
                },
                takeHit: {
                    imageSrc: 'assets/img/kenji/take-hit.png',
                    flippedImageSrc: 'assets/img/kenji/take-hit-flipped.png',
                    totalFrames: 3,
                },
                die: {
                    imageSrc: 'assets/img/kenji/death.png',
                    flippedImageSrc: 'assets/img/kenji/death-flipped.png',
                    totalFrames: 7,
                },
            },
            scale: 2.5,
            offset: { x: 215, y: 172 },
        });
        this.setEnemy(enemy);
    };

    private decreaseTimer = (): void => {
        if (this.getPlayer().isDying() || this.getEnemy().isDying()) {
            return;
        }
        
        this.setGameTimeout(setTimeout(this.decreaseTimer, 1000));
        if (this.getTimer() > 0) {
            this.setTimer(this.getTimer() - 1);
            this.gameTimer.innerHTML = this.getTimer().toString();
        }
    };

    private setCanvasSize = (): void => {
        // const width: number = window.innerWidth;
        // const height: number = window.innerHeight;
        const width: number = defaultCanvasWidth;
        const height: number = defaultCanvasHeight;
        
        this.canvas.width = width;
        this.canvas.height = height;

        this.getContext().clearRect(0, 0, width, height);
        this.getContext().fillRect(0, 0, width, height);
        this.draw();
    }

    private createFighter = (props: FighterProps): Fighter => {
        const fighter = new Fighter(props);
        fighter.draw();
        return fighter;
    };

    private checkFighterAttacked = ({ attacker, defender }: { attacker: Fighter; defender: Fighter; }): boolean => {
        if (
            attacker.getAttackBox().position.x + attacker.getAttackBoxOffset().width >= defender.getPosition().x
            && attacker.getAttackBox().position.x <= defender.getPosition().x + defender.width
            && attacker.getAttackBox().position.y + attacker.getAttackBoxOffset().height >= defender.getPosition().y
            && attacker.getAttackBox().position.y <= defender.getPosition().y + defender.height
            && attacker.getIsAttacking()
            && attacker.getCurrentFrame() === Math.ceil(attacker.getSprites().attack.totalFrames / 2)
        ) {
            attacker.setIsAttacking(false);
            defender.takeHit(attacker.getDamage());
            return true;
        }
        return false;
    };

    private detectPlayerAttacking = (): void => {
        const wasAttacked = this.checkFighterAttacked({
            attacker: this.getPlayer(),
            defender: this.getEnemy(),
        });
        if (wasAttacked) {
            gsap.fromTo(
                this.enemyHealth, 
                {
                    width: `${this.getEnemy().getHealth() + this.getPlayer().getDamage()}%`,
                },
                {
                    width: `${this.getEnemy().getHealth()}%`,
                }
            );
        }
    };

    private detectEnemyAttacking = (): void => {
        const wasAttacked = this.checkFighterAttacked({
            attacker: this.getEnemy(),
            defender: this.getPlayer(),
        });
        if (wasAttacked) {
            gsap.fromTo(
                this.playerHealth, 
                {
                    width: `${this.getPlayer().getHealth() + this.getEnemy().getDamage()}%`,
                },
                {
                    width: `${this.getPlayer().getHealth()}%`,
                }
            );
        }
    };

    private endPlayerAttack = (): void => {
        if (this.getPlayer().getIsAttacking()
            && this.getPlayer().getCurrentFrame() === 
                Math.ceil(this.getPlayer().getSprites().attack.totalFrames / 2)
        ) {
            this.getPlayer().setIsAttacking(false);
        }
    };
    
    private endEnemyAttack = (): void => {
        if (this.getEnemy().getIsAttacking()
            && this.getEnemy().getCurrentFrame() === 
                Math.ceil(this.getEnemy().getSprites().attack.totalFrames / 2)
        ) {
            this.getEnemy().setIsAttacking(false);
        }
    };

    private detectWallCollision = (fighter: Fighter): void => {
        if (
            fighter.getPosition().x <= 0
            && fighter.getVelocity().x < 0
        ) {
            fighter.setVelocity({ x: 0, y: fighter.getVelocity().y });
        } else if (
            fighter.getPosition().x + fighter.width >= this.canvas.width
            && fighter.getVelocity().x > 0
        ) {
            fighter.setVelocity({ x: 0, y: fighter.getVelocity().y });
        }
    };

    private detectPlayerWallCollision = (): void => {
        this.detectWallCollision(this.getPlayer());
    };

    private detectEnemyWallCollision = (): void => {
        this.detectWallCollision(this.getEnemy());
    };

    private determineDirectionFaced = (): void => {
        if (this.getPlayer().getPosition().x < this.getEnemy().getPosition().x) {
            if (!this.getPlayer().getIsDead() && !this.getPlayer().isDying()) {
                this.getPlayer().setDirectionFaced(Direction.Right);
                this.getPlayer().setShouldFlip(false);
            }
            if (!this.getEnemy().getIsDead() && !this.getEnemy().isDying()) {
                this.getEnemy().setDirectionFaced(Direction.Left);
                this.getEnemy().setShouldFlip(false);
            }
        } else {
            if (!this.getPlayer().getIsDead() && !this.getPlayer().isDying()) {
                this.getPlayer().setDirectionFaced(Direction.Left);
                this.getPlayer().setShouldFlip(true);
            }
            if (!this.getEnemy().getIsDead() && !this.getEnemy().isDying()) {
                this.getEnemy().setDirectionFaced(Direction.Right);
                this.getEnemy().setShouldFlip(true);
            }
        }
    };

    private stopAnimation = (): void => {
        if (this.getAnimationRequestId()) {
            cancelAnimationFrame(this.getAnimationRequestId());
        }
    };

    private stopGameTimer = (): void => {
        if (this.getGameTimeout()) {
            clearTimeout(this.getGameTimeout());
        }
    };

    private checkGameOver = (): void => {
        let gameOver: boolean = false;
        
        if (this.getPlayer().isDying()) {
            this.gameOverTitle.innerHTML = 'Game over, you lose!';
            this.getPlayer().destroy();
            setTimeout(() => {
                this.endGame();
            }, 3000);
        } else if (this.getEnemy().isDying()) {
            this.gameOverTitle.innerHTML = 'Game over, you win!';
            this.getEnemy().destroy();
            setTimeout(() => {
                this.endGame();
            }, 3000);
        }

        if (this.getTimer() <= 0) {
            this.gameOverTitle.innerHTML = 'Draw, time is up!';
            gameOver = true;
        }

        if (gameOver) {
            this.endGame();
        }
    };

    private endGame = (): void => {
        this.stopAnimation();
        this.stopGameTimer();
        
        this.getPlayer().destroy();
        this.getEnemy().destroy();

        // ensure closed before re-opening otherwise error will be thrown
        this.gameOverDialog.close();
        this.gameOverDialog.showModal();
    };

    public run = (): void => {
        const animationRequestId = requestAnimationFrame(this.run);
        this.setAnimationRequestId(animationRequestId);

        this.getContext().fillStyle = Colour.Black;
        this.getContext().fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.detectPlayerAttacking();
        this.detectEnemyAttacking();
        this.endPlayerAttack();
        this.endEnemyAttack();
        this.detectPlayerWallCollision();
        this.detectEnemyWallCollision();
        this.determineDirectionFaced();
        
        this.getBackground().update();
        this.getShop().update();
        // overlay so that the background and shop are less in focus
        this.getContext().fillStyle = Colour.Overlay;
        this.getContext().fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.getPlayer().update();
        this.getEnemy().update();

        this.checkGameOver();
    };

    private handleGameOverBtnClick = (): void => {
        this.destroy();
        window.location.reload();
    };

    private handleUnload = (_event: Event) => {
        this.destroy();
    };

    private bindListeners = (): void => {
        this.gameOverBtn.addEventListener('click', this.handleGameOverBtnClick);
        
        window.addEventListener('resize', this.setCanvasSize);
        window.addEventListener('unload', this.handleUnload);
    };

    private destroy = (): void => {
        this.gameOverBtn.removeEventListener('click', this.handleGameOverBtnClick);
        
        window.removeEventListener('resize', this.setCanvasSize);
        window.removeEventListener('unload', this.handleUnload);
    };
};
