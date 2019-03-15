const regex = /[^\/]+@=[^\/]+/g
const fullMsg = "type@=online_noble_list/num@=13722/rid@=99999/nl@=uid@AA=228213346@ASnn@AA=商界巨头釒M总@ASicon@AA=avatar_v3@AAS201903@AAS88c1f0eff440e818671fce9741834ec2@ASne@AA=6@ASlv@AA=105@ASrk@AA=66@ASpg@AA=1@ASrg@AA=1@ASsahf@AA=0@AS@Suid@AA=59136814@ASnn@AA=99999丶大斌子@ASicon@AA=avatar_v3@AAS201810@AAS9b60ef0833f8b9501c2bde83b7747e68@ASne@AA=6@ASlv@AA=92@ASrk@AA=66@ASpg@AA=1@ASrg@AA=4@ASsahf@AA=0@AS@Suid@AA=227705275@ASnn@AA=向皇灬特工队@ASicon@AA=avatar_v3@AAS201812@AAS64a9604579a025884e2abc64569b29e8@ASne@AA=6@ASlv@AA=78@ASrk@AA=66@ASpg@AA=1@ASrg@AA=1@ASsahf@AA=0@AS@Suid@AA=83823070@ASnn@AA=海鲜丸子24小时超市@ASicon@AA=avatar_v3@AAS201903@AAScd87344bf84a4d6a9187cc6ce0f22da1@ASne@AA=6@ASlv@AA=75@ASrk@AA=66@ASpg@AA=1@ASrg@AA=1@ASsahf@AA=0@AS@Suid@AA=190035487@ASnn@AA=丶柚子小姐姐@ASicon@AA=avatar_v3@AAS201812@AAS54c87d979b26b13921955576fe773564@ASne@AA=6@ASlv@AA=65@ASrk@AA=66@ASpg@AA=1@ASrg@AA=1@ASsahf@AA=0@AS@Suid@AA=18694718@ASnn@AA=岁月轻狂丶Moses@ASicon@AA=avatar@AAS018@AAS69@AAS47@AAS18_avatar@ASne@AA=6@ASlv@AA=63@ASrk@AA=66@ASpg@AA=1@ASrg@AA=1@ASsahf@AA=0@AS@Suid@AA=116677845@ASnn@AA=温柚v最强女打野@ASicon@AA=avatar_v3@AAS201811@AAS0b47610a6e270c7b7bcb309f7a1ce55b@ASne@AA=6@ASlv@AA=56@ASrk@AA=66@ASpg@AA=1@ASrg@AA=1@ASsahf@AA=0@AS@Suid@AA=41478500@ASnn@AA=中憬珠宝569349@ASicon@AA=avatar@AASface@AAS201605@AAS10@AASaefb7ab352926ca23def39cf8d715081@ASne@AA=5@ASlv@AA=81@ASrk@AA=55@ASpg@AA=1@ASrg@AA=1@ASsahf@AA=0@AS@Suid@AA=19579333@ASnn@AA=三千uksd@ASicon@AA=avatar_v3@AAS201903@AAS6f3ace67cce94933a5620f7866a8fb47@ASne@AA=5@ASlv@AA=73@ASrk@AA=55@ASpg@AA=1@ASrg@AA=1@ASsahf@AA=0@AS@Suid@AA=215727195@ASnn@AA=糟老头家的果然@ASicon@AA=avatar_v3@AAS201903@AAS3155d027269f41ca87425992b67a9676@ASne@AA=5@ASlv@AA=55@ASrk@AA=55@ASpg@AA=1@ASrg@AA=1@ASsahf@AA=0@AS@Suid@AA=56985531@ASnn@AA=拜月教嗷呜嗷呜大魔王@ASicon@AA=avatar_v3@AAS201812@AAS6dd496457a19412180a196cdc0737112@ASne@AA=4@ASlv@AA=77@ASrk@AA=44@ASpg@AA=1@ASrg@AA=1@ASsahf@AA=0@AS@Suid@AA=15890722@ASnn@AA=小鸡丶DY万岁上市成功@ASicon@AA=avatar_v3@AAS201903@AAS6f8cf3b997b0420e83d1731a736cb321@ASne@AA=4@ASlv@AA=76@ASrk@AA=44@ASpg@AA=1@ASrg@AA=1@ASsahf@AA=0@AS@Suid@AA=192863659@ASnn@AA=茜红绛朱色@ASicon@AA=avatar_v3@AAS201901@AAS32570c72e64141a6960f497b64da65f9@ASne@AA=4@ASlv@AA=73@ASrk@AA=44@ASpg@AA=1@ASrg@AA=1@ASsahf@AA=0@AS@Suid@AA=258606430@ASnn@AA=二月末故城凄凉@ASicon@AA=avatar_v3@AAS201902@AAS16de1c4857ebfc3cbd594683a433ca0a@ASne@AA=4@ASlv@AA=73@ASrk@AA=44@ASpg@AA=1@ASrg@AA=1@ASsahf@AA=0@AS@Suid@AA=2794652@ASnn@AA=好困真的好困的牛牛@ASicon@AA=avatar_v3@AAS201812@AAS75a25f133d31adc2fbba333c37e8eb62@ASne@AA=4@ASlv@AA=68@ASrk@AA=44@ASpg@AA=1@ASrg@AA=1@ASsahf@AA=0@AS@Suid@AA=26987990@ASnn@AA=火车海鲜丸@ASicon@AA=avatar_v3@AAS201903@AAS5c39df62fea34360b6613da006dfb010@ASne@AA=4@ASlv@AA=63@ASrk@AA=44@ASpg@AA=1@ASrg@AA=1@ASsahf@AA=0@AS@Suid@AA=33517945@ASnn@AA=你的老鼠弟弟@ASicon@AA=avatar_v3@AAS201810@AASe8ebc7b762adf3064557612c5cb40732@ASne@AA=4@ASlv@AA=63@ASrk@AA=44@ASpg@AA=1@ASrg@AA=1@ASsahf@AA=0@AS@Suid@AA=146201308@ASnn@AA=DNF岁月@ASicon@AA=avatar_v3@AAS201903@AAS872042c4d41282ffbb1b85d51a43d480@ASne@AA=4@ASlv@AA=61@ASrk@AA=44@ASpg@AA=1@ASrg@AA=4@ASsahf@AA=0@AS@Suid@AA=242888864@ASnn@AA=阿舜老哥@ASicon@AA=avatar_v3@AAS201811@AAS64cc38bf273a62f4713c89ba26bdadd8@ASne@AA=4@ASlv@AA=60@ASrk@AA=44@ASpg@AA=1@ASrg@AA=1@ASsahf@AA=0@AS@Suid@AA=46277956@ASnn@AA=等一下维乐@ASicon@AA=avatar_v3@AAS201812@AAS3ce8d25758ea46049941846140a1244b@ASne@AA=4@ASlv@AA=59@ASrk@AA=44@ASpg@AA=1@ASrg@AA=1@ASsahf@AA=0@AS@S/"

const nlMsg = 'uid@AA=228213346@ASnn@AA=商界巨头釒M总@ASicon@AA=avatar_v3@AAS201903@AAS88c1f0eff440e818671fce9741834ec2@ASne@AA=6@ASlv@AA=105@ASrk@AA=66@ASpg@AA=1@ASrg@AA=1@ASsahf@AA=0@AS@Suid@AA=59136814@ASnn@AA=99999丶大斌子@ASicon@AA=avatar_v3@AAS201810@AAS9b60ef0833f8b9501c2bde83b7747e68@ASne@AA=6@ASlv@AA=92@ASrk@AA=66@ASpg@AA=1@ASrg@AA=4@ASsahf@AA=0@AS@Suid@AA=227705275@ASnn@AA=向皇灬特工队@ASicon@AA=avatar_v3@AAS201812@AAS64a9604579a025884e2abc64569b29e8@ASne@AA=6@ASlv@AA=78@ASrk@AA=66@ASpg@AA=1@ASrg@AA=1@ASsahf@AA=0@AS@Suid@AA=83823070@ASnn@AA=海鲜丸子24小时超市@ASicon@AA=avatar_v3@AAS201903@AAScd87344bf84a4d6a9187cc6ce0f22da1@ASne@AA=6@ASlv@AA=75@ASrk@AA=66@ASpg@AA=1@ASrg@AA=1@ASsahf@AA=0@AS@Suid@AA=190035487@ASnn@AA=丶柚子小姐姐@ASicon@AA=avatar_v3@AAS201812@AAS54c87d979b26b13921955576fe773564@ASne@AA=6@ASlv@AA=65@ASrk@AA=66@ASpg@AA=1@ASrg@AA=1@ASsahf@AA=0@AS@Suid@AA=18694718@ASnn@AA=岁月轻狂丶Moses@ASicon@AA=avatar@AAS018@AAS69@AAS47@AAS18_avatar@ASne@AA=6@ASlv@AA=63@ASrk@AA=66@ASpg@AA=1@ASrg@AA=1@ASsahf@AA=0@AS@Suid@AA=116677845@ASnn@AA=温柚v最强女打野@ASicon@AA=avatar_v3@AAS201811@AAS0b47610a6e270c7b7bcb309f7a1ce55b@ASne@AA=6@ASlv@AA=56@ASrk@AA=66@ASpg@AA=1@ASrg@AA=1@ASsahf@AA=0@AS@Suid@AA=41478500@ASnn@AA=中憬珠宝569349@ASicon@AA=avatar@AASface@AAS201605@AAS10@AASaefb7ab352926ca23def39cf8d715081@ASne@AA=5@ASlv@AA=81@ASrk@AA=55@ASpg@AA=1@ASrg@AA=1@ASsahf@AA=0@AS@Suid@AA=19579333@ASnn@AA=三千uksd@ASicon@AA=avatar_v3@AAS201903@AAS6f3ace67cce94933a5620f7866a8fb47@ASne@AA=5@ASlv@AA=73@ASrk@AA=55@ASpg@AA=1@ASrg@AA=1@ASsahf@AA=0@AS@Suid@AA=215727195@ASnn@AA=糟老头家的果然@ASicon@AA=avatar_v3@AAS201903@AAS3155d027269f41ca87425992b67a9676@ASne@AA=5@ASlv@AA=55@ASrk@AA=55@ASpg@AA=1@ASrg@AA=1@ASsahf@AA=0@AS@Suid@AA=56985531@ASnn@AA=拜月教嗷呜嗷呜大魔王@ASicon@AA=avatar_v3@AAS201812@AAS6dd496457a19412180a196cdc0737112@ASne@AA=4@ASlv@AA=77@ASrk@AA=44@ASpg@AA=1@ASrg@AA=1@ASsahf@AA=0@AS@Suid@AA=15890722@ASnn@AA=小鸡丶DY万岁上市成功@ASicon@AA=avatar_v3@AAS201903@AAS6f8cf3b997b0420e83d1731a736cb321@ASne@AA=4@ASlv@AA=76@ASrk@AA=44@ASpg@AA=1@ASrg@AA=1@ASsahf@AA=0@AS@Suid@AA=192863659@ASnn@AA=茜红绛朱色@ASicon@AA=avatar_v3@AAS201901@AAS32570c72e64141a6960f497b64da65f9@ASne@AA=4@ASlv@AA=73@ASrk@AA=44@ASpg@AA=1@ASrg@AA=1@ASsahf@AA=0@AS@Suid@AA=258606430@ASnn@AA=二月末故城凄凉@ASicon@AA=avatar_v3@AAS201902@AAS16de1c4857ebfc3cbd594683a433ca0a@ASne@AA=4@ASlv@AA=73@ASrk@AA=44@ASpg@AA=1@ASrg@AA=1@ASsahf@AA=0@AS@Suid@AA=2794652@ASnn@AA=好困真的好困的牛牛@ASicon@AA=avatar_v3@AAS201812@AAS75a25f133d31adc2fbba333c37e8eb62@ASne@AA=4@ASlv@AA=68@ASrk@AA=44@ASpg@AA=1@ASrg@AA=1@ASsahf@AA=0@AS@Suid@AA=26987990@ASnn@AA=火车海鲜丸@ASicon@AA=avatar_v3@AAS201903@AAS5c39df62fea34360b6613da006dfb010@ASne@AA=4@ASlv@AA=63@ASrk@AA=44@ASpg@AA=1@ASrg@AA=1@ASsahf@AA=0@AS@Suid@AA=33517945@ASnn@AA=你的老鼠弟弟@ASicon@AA=avatar_v3@AAS201810@AASe8ebc7b762adf3064557612c5cb40732@ASne@AA=4@ASlv@AA=63@ASrk@AA=44@ASpg@AA=1@ASrg@AA=1@ASsahf@AA=0@AS@Suid@AA=146201308@ASnn@AA=DNF岁月@ASicon@AA=avatar_v3@AAS201903@AAS872042c4d41282ffbb1b85d51a43d480@ASne@AA=4@ASlv@AA=61@ASrk@AA=44@ASpg@AA=1@ASrg@AA=4@ASsahf@AA=0@AS@Suid@AA=242888864@ASnn@AA=阿舜老哥@ASicon@AA=avatar_v3@AAS201811@AAS64cc38bf273a62f4713c89ba26bdadd8@ASne@AA=4@ASlv@AA=60@ASrk@AA=44@ASpg@AA=1@ASrg@AA=1@ASsahf@AA=0@AS@Suid@AA=46277956@ASnn@AA=等一下维乐@ASicon@AA=avatar_v3@AAS201812@AAS3ce8d25758ea46049941846140a1244b@ASne@AA=4@ASlv@AA=59@ASrk@AA=44@ASpg@AA=1@ASrg@AA=1@ASsahf@AA=0@AS@S'

const deserialize = (message) => {
    if (message === null ) {
        return null;
    }
    const record = {};
    const items = message.match(regex);
    if(items === null) {
        return message;
    }
    items.forEach( item => {
        const kvps = item.split('@=');
        const key = kvps[0];
        const value = kvps[1]
        const escapeSlashvalues = value.replace(/@S/g, '/').split('/');
        if (escapeSlashvalues.length > 2) {
            record[key] = escapeSlashvalues.map(escapeSlashvalue => deserialize( escapeSlashvalue.replace(/@A/g, '@').replace(/@S/g, '/').replace(/@A/g, '@')))
        } else {
            record[key] = escapeSlashvalues[0]
        }

    }) 
    return record;
}


console.log(deserialize(fullMsg))