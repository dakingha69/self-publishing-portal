import {Template} from 'meteor/templating';
import {Session} from 'meteor/session';

import {bidToProject, deactivateInsertion} from '/client/lib/ethereum/contracts/insertionRegisterContractHelper';

import './insertionDetails.html';

Template.views_insertionDetails.onRendered(function () {
    $('.modal-trigger').leanModal({
        dismissible: true, // Modal can be dismissed by clicking outside of the modal
        opacity: .5, // Opacity of modal background
        in_duration: 300, // Transition in duration
        out_duration: 200, // Transition out duration
        starting_top: '10%', // Starting top style attribute
        ending_top: '20%', // Ending top style attribute
        ready: function (modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
        },
        complete: function () { // Callback for Modal close
        }
    });
});

Template.views_insertionDetails.helpers({
    insertion: function () {
        const id = parseInt(Session.get('insertionId'));
        return Insertions.findOne({_id: id});
    },
    isProject: (insertion) => {
        return insertion.isProject;
    },
    maxContribution: function () {
        return EthAccounts.find().fetch()[0].balance;
    },
    isOwner: (insertion) => {
        return (account === insertion.owner);
    }
});

Template.views_insertionDetails.events({
    'click .js-bid' () {
        const id = parseInt(Session.get('insertionId'));
        const bidAmount = web3.toWei($('#bid').val(), 'ether');
        const insertion = Insertions.findOne({_id: id});
        if (insertion.owner === account) {
            Materialize.toast('You can not bid for your own project!', 3000);
        } else {
            bidToProject(id, bidAmount, () => {
                FlowRouter.go('/insertions');
            });
        }
    },
    'click .js-hire-provider' () {
        const id = parseInt(Session.get('insertionId'));
        const insertion = Insertions.findOne({_id: id});
        if (insertion.owner === account) {
            Materialize.toast('You can not hire yourself!', 3000);
        } else {
            Session.set('hiredBid', {
                isProject: false,
                amount: insertion.hourlyRate,
                bidder: insertion.owner
            });
            FlowRouter.go('/contracts/create');
        }
    },
    'click .js-hire-project' (event) {
        Session.set('hiredBid', {
            isProject: true,
            amount: parseInt(event.target.dataset.amount),
            bidder: bidderAddress = event.target.dataset.bidder
        });
        FlowRouter.go('/contracts/create');
    },
    'click .js-deactivate' () {
        const id = parseInt(Session.get('insertionId'));
        deactivateInsertion(id, () => {
            FlowRouter.go('/insertions');
        });
    }
});