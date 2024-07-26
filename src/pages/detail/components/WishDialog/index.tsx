import {useState, useEffect} from 'react';
import {
	trackGoWishGoldClick,
	trackGoWishGoldClose,
} from '@/public/track/awardDetail';

let Time

const WishDialog = (props) => {
  const {wishType, onCloseWish =() => {}, wishImage} = props;
  const [lastTime, setlastTime] = useState(5);
  const goWish = () => {
    // const { wishType, wishImage } = this.props;
    trackGoWishGoldClick({
      component:
        wishType === 'NEWUSER'
          ? '新用户弹窗'
          : wishType === 'CONTINUITYTHREE'
            ? '参与3次抽奖弹窗'
            : wishImage
              ? '心愿金限时活动-参与5次弹窗'
              : '参与5次抽奖弹窗',
    });
    ap.pushWindow(
      'alipays://platformapi/startapp?appId=2018103161898599&page=pages%2FpointsIndex%2FpointsIndex',
    );
    onCloseWish && onCloseWish({
        isGoWishClose: true,
      });
  }
  const close = () => {
    trackGoWishGoldClose({
      component:
        wishType === 'NEWUSER'
          ? '新用户弹窗'
          : wishType === 'CONTINUITYTHREE'
            ? '参与3次抽奖弹窗'
            : '参与5次抽奖弹窗',
    });
        onCloseWish && onCloseWish();
  }
  useEffect(() => {
    return () => {
      Time && clearInterval(Time);
    }
  },[])
  return <div className="detail-wish-dialog">
  <div className="detail-wish-dialog-mask"></div>
  {
    wishType === 'NEWUSER' && <div className="detail-wish-dialog-newuser">
    <div className="detail-wish-dialog-success tac">
      参与成功
    </div>
    <div className="detail-wish-dialog-congratulations tac">
      恭喜解锁天天抽奖【心愿金】
    </div>
    <div className="detail-wish-dialog-get">
      获得心愿金
    </div>
    <div className="detail-wish-dialog-acount">
      50
    </div>
    <div className="detail-wish-dialog-lucky tac">
      越努力越幸运，奖励坚持抽奖的你！
    </div>
    <div className="btn-primary" onClick={goWish}>
      去领取
    </div>
    <div className="detail-wish-dialog-giveup tac" onClick={close}>
      放弃领取
    </div>
  </div> 
  }
  {
    wishType === 'CONTINUITYTHREE' || wishType === 'CONTINUITYFIVE' && <div className="detail-wish-dialog-three">
    <div className="detail-wish-dialog-success tac">
      成功参与{wishType === 'CONTINUITYTHREE' ? '3' : '5'}次抽奖
    </div>
    {
      wishType === 'CONTINUITYTHREE' ? <>
       <div className="detail-wish-dialog-get mt-56">
        获得心愿金
      </div>
      <div className="detail-wish-dialog-acount">
        {wishType === 'CONTINUITYTHREE' ? '+30' : '+50'}
      </div>
      <div className="detail-wish-dialog-lucky tac mt-20">
        心愿金可0元兑换实物奖品哦！
      </div>
      <img className="detail-wish-dialog-hearticon" src="https://mdn.alipayobjects.com/huamei_zjbdv1/afts/img/A*7IqXQ6Ex45MAAAAAAAAAAAAADg6FAQ/original" />
 </> :       <img className="detail-wish-dialog-img" src={wishImage || 'https://mdn.alipayobjects.com/huamei_zjbdv1/afts/img/A*WJ12RYt6AjsAAAAAAAAAAAAADg6FAQ/original'} />

    }
   
    
    <div className="btn-primary" onClick={goWish}>
      去领取
    </div>
    <div className="detail-wish-dialog-giveup tac" onClick={close}>
      放弃领取
    </div>
  </div>
  }
{/*   
  <div a:if="{{wishType === 'OLDUSERPRIVATE' || wishType === 'oldUserNoPrivate' || wishType === 'OLDUSERPRIVATE_RECOMMEND'}}" className="detail-wish-dialog-threeday">
    <block a:if="{{wishType === 'OLDUSERPRIVATE' || wishType === 'OLDUSERPRIVATE_RECOMMEND'}}">
      <div className="btn-primary tac" onTap="goSelf">继续抽奖</div>
      <img className="detail-wish-dialog-threeday-close" onTap="close" src="https://mdn.alipayobjects.com/portal_s6jpcc/afts/img/A*_li4QLG0KKkAAAAAAAAAAAAAAQAAAQ/original" />
    </block>
    <block a:else>
      <div className="btn-primary tac" onTap="close">我知道了 ({{lastTime}}s)</div>
    </block>
    */}
  </div>
</div>
}

export default WishDialog