//Serializes RecordableDrawing object to JSON string
	
//	@param drawingObj of type RecordableDrawing
//	@returns JSON String
//
function serializeDrawing (drawingObj)
{
	if (drawingObj.recordings.length == 0)
		return null;
	
	var modifiedRecordings = new Array();
	
	for (var i = 0; i < drawingObj.recordings.length; i++)
	{
		modifiedRecordings.push(serializeRecording(drawingObj.recordings[i]));
	}
	
	return JSON.stringify(modifiedRecordings);

    //downloadJSON()

}

// function downloadJSON(data, filename) {
//     var blob = new Blob([data], { type: 'application/json' });
//     var url = URL.createObjectURL(blob);
//     var a = document.createElement('a');
//     a.href = url;
//     a.download = filename;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
// }

function serializeRecording (recording)
{
	var recordingWrp = new RecordingWrapper();
	
	var currActionSet = recording.actionsSet;
	
	while (currActionSet != null)
	{
		recordingWrp.actionsets.push(serializeActionSet(currActionSet));
		currActionSet = currActionSet.next;
	}
	
	return recordingWrp;
}

function serializeActionSet (actionSet)
{
	var actionSetWrp = new ActionSetWrapper();
	actionSetWrp.interval = actionSet.interval;
	for (var i = 0; i < actionSet.actions.length; i++)
	{
		var actionWrp = serializeAction(actionSet.actions[i]);
		if (actionWrp != null)
			actionSetWrp.actions.push(actionWrp);
	}
	return actionSetWrp;
}

function serializeAction (action)
{
	switch (action.aT)
	{
		case 1: //Point Action
			return serializePoint (action);
		case 2: //SeColor Action
			return {aT : 2,
					color : action.color};
		case 3: //Set Stroke Size
			return {aT : 3, 
					size : action.size};
	}
	
	return null;
}

function serializePoint (point)
{
	var pointWrp = new PointWrapper();
	pointWrp.ty = point.ty;
	pointWrp.aT = point.aT;
	pointWrp.x = point.x;
	pointWrp.y = point.y;
	pointWrp.iM = point.iM;
	
	return pointWrp;
}

function serializeSetColorAction (colorAction)
{
	var colorInfo = {aT : 2,
		color : colorAction.color 
		};
	
	return colorInfo;
}

function deserializeDrawing (serData)
{
	try
	{
		var recordings =  JSON.parse(serData);
		console.log("jsonparsed")
		var result = new Array();
		if (recordings instanceof Array )
		{
			for (var i = 0; i < recordings.length; i++)
			{
				var rec = deserializeRecording(recordings[i]);
				if (rec != null)
					result.push(rec);
			}
		}
		
		return result;
	}
	catch (e)
	{
		return "Error : " + e.message;
	}
	
	return null;
}

function deserializeRecording(recordingWrp)
{
	var rec = new Recording();
	
	var prevActionSet = null;
	for (var i = 0; i < recordingWrp.actionsets.length; i++)
	{
		var actionSet = deserializeActionSet(recordingWrp.actionsets[i]);
		if (actionSet != null)
		{
			if (prevActionSet == null)
				rec.actionsSet = actionSet;
			else
				prevActionSet.next = actionSet;
			prevActionSet = actionSet;
		}
	}
	
	return rec;
}

function deserializeActionSet(actionSetWrp)
{
	var actionSet = new ActionsSet();
	actionSet.actions = new Array();
	actionSet.interval = actionSetWrp.interval;
	for (var i = 0; i < actionSetWrp.actions.length; i++)
	{
		var action = deserializeAction(actionSetWrp.actions[i]);
		if (action != null)
			actionSet.actions.push(action);
	}
	
	return actionSet;
}

function deserializeAction (actionWrp)
{
	switch (actionWrp.aT)
	{
		case 1: //Point action
			return deserializePoint(actionWrp);
		case 2: //SetColor action
			return new SetColor(actionWrp.color);
		case 3: //Set Stroke Size
			return new SetStrokeSize(actionWrp.size);
	}
	
	return null;
}

function deserializePoint (pointWrp)
{
	var point = new Point();
	point.ty = pointWrp.ty;
	point.x = pointWrp.x;
	point.y = pointWrp.y;
	point.aT = pointWrp.aT;
	point.iM = pointWrp.iM;
	
	return point;
}

function RecordingWrapper()
{
	var self = this;
	this.actionsets = new Array();
}

function ActionSetWrapper()
{
	var self = this;
	this.actions = new Array();
	this.interval = 0;
}

function ActionWapper()
{
	var self = this;
	this.aT; // 1 - Point, other action types could be added later
	this.x = 0;
	this.y = 0;
	this.iM = false;
}

function PointWrapper()
{
	var self = this;
	this.ty ; //0 - moveto, 1 - lineto
}

PointWrapper.prototype = new ActionWapper();
