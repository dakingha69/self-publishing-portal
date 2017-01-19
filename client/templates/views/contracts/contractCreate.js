import {Template} from 'meteor/templating';
import {Session} from 'meteor/session';
import {ReactiveVar} from 'meteor/reactive-var';

import {createIndividualContract} from '../../../lib/ethereum/contracts/individualContractHelper';

import './contractCreate.html';

Template.views_contractCreate.onCreated(() => {
    Template.instance().contractType = new ReactiveVar('variable');
    Template.instance().varType = new ReactiveVar();
    Template.instance().rateType = new ReactiveVar('ETH');
});

Template.views_contractCreate.onRendered(() => {
    $('select').material_select();
});

Template.views_contractCreate.events({
    'click .js-choose-fix'() {
        Template.instance().contractType.set('fixed');
    },
    'click .js-choose-var'() {
        Template.instance().contractType.set('variable');
    },
    'click .js-choose-combination'() {
        Template.instance().contractType.set('combination');
    },
    'click .js-choose-piece'() {
        Template.instance().varType.set('piece');
    },
    'click .js-choose-hour'() {
        Template.instance().varType.set('hour');
    },
    'click .js-choose-like'() {
        Template.instance().varType.set('like');
    },
    'click .js-choose-comment'() {
        Template.instance().varType.set('comment');
    },
    'click .js-choose-share'() {
        Template.instance().varType.set('share');
    },
    'click .js-change-rate' () {
        const projectRateType = Template.instance().rateType.get() === 'PERCENTAGE' ? 'ETH' : 'PERCENTAGE';
        Template.instance().rateType.set(projectRateType);
    },
    'click .js-create-contract' () {
        const contractType = Template.instance().contractType.get();
        const varType = Template.instance().varType.get();
        const name = $('#title').val();
        const description = $('#description').val();
        //const contractPartner = '0xf862a22835e7c3560af9498ea60f1425427aaee5';
        const contractPartner = $('#partner').val();
        let contractTypeIds = [];
        let valueTypeId, varReward, fixReward;
        if (contractType === 'fixed') {
            contractTypeIds.push(0);
            valueTypeId = 0;
            varReward = 0;
            fixReward = web3.toWei($('#fixedPrice').val(), 'ether');
        } else if (contractType === 'variable') {
            fixReward = 0;
            if (varType === 'piece') valueTypeId = 1;
            else if (varType === 'hour') valueTypeId = 2;
            else if (varType === 'like') valueTypeId = 3;
            else if (varType === 'comment' ) valueTypeId = 4;
            else if (varType === 'share') valueTypeId = 5;
            if (Template.instance().rateType.get() === 'PERCENTAGE') {
                contractTypeIds.push(2);
                varReward = $('#percentageVarPrice').val();
            } else if (Template.instance().rateType.get() === 'ETH' && varType === 'hour') {
                contractTypeIds.push(1);
                varReward = web3.toWei($('#absVarPrice').val(), 'ether');
            } else {
                contractTypeIds.push(3);
                varReward = web3.toWei($('#absVarPrice').val(), 'ether');
            }
        } else {
            fixReward = web3.toWei($('#combiFixedPrice').val(), 'ether');
            contractTypeIds.push(0);
            if (varType === 'piece') valueTypeId = 1;
            else if (varType === 'hour') valueTypeId = 2;
            else if (varType === 'like') valueTypeId = 3;
            else if (varType === 'comment' ) valueTypeId = 4;
            else if (varType === 'share') valueTypeId = 5;
            if (Template.instance().rateType.get() === 'PERCENTAGE') {
                contractTypeIds.push(2);
                varReward = $('#combiPercentageVarPrice').val();
            } else if (Template.instance().rateType.get() === 'ETH' && varType === 'hour') {
                contractTypeIds.push(1);
                varReward = web3.toWei($('#combiAbsVarPrice').val(), 'ether');
            } else {
                contractTypeIds.push(3);
                varReward = web3.toWei($('#combiAbsVarPrice').val(), 'ether');
            }
        }
        createIndividualContract(name, description, contractPartner, fixReward, varReward, valueTypeId, contractTypeIds, () => {
            FlowRouter.go('/contracts');
        });
    }
});

Template.views_contractCreate.helpers({
    getContractType: () => {
        return Template.instance().contractType.get();
    },
    getVarType: () => {
        return Template.instance().varType.get();
    },
    isPercentage: () => {
        return Template.instance().rateType.get() === 'PERCENTAGE';
    }
});