/*
 * Copyright 2011-2013 Jiří Janoušek <janousek.jiri@gmail.com>
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met: 
 * 
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer. 
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution. 
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/* Anonymous function is used not to pollute environment */
(function(Nuvola)
{
	/**
	 * Creates integration binded to Nuvola JS API
	 */
	var Integration = function()
	{
		/* Overwrite default commnad function */
		Nuvola.onMessageReceived = Nuvola.bind(this, this.messageHandler);
		
		/* For debug output */
		this.name = "SoundCloud";
		
		/* Let's run */
		this.state = Nuvola.STATE_NONE;
		this.can_thumbs_up = null;
		this.can_thumbs_down = null;
		this.can_prev = null;
		this.can_next = null;
		this.update();
	};
	
	/**
	 * Updates current playback state
	 */
	Integration.prototype.update = function()
	{
		// Default values
		var state = Nuvola.STATE_NONE;
		var can_prev = true;
		var can_next = true;
		var can_thumbs_up = false;
		var can_thumbs_down = false;
		var album_art = null;
		var song = $('.playing .soundTitle__title').text();
		var artist = $('.playing .soundTitle__username').text();
		var album = null;
		
		
		// Retrieve song details here
		state = Nuvola.STATE_PLAYING;
		can_thumbs_up = true;
		can_thumbs_down = false;
		
		// Save state
		this.state = state;
		
		// Submit data to Nuvola backend
		Nuvola.updateSong(song, artist, album, album_art, state);


		$('.badge_hey').hide();

		// Update actions
		if (this.can_prev !== can_prev)
		{
			this.can_prev = can_prev;
			Nuvola.updateAction(Nuvola.ACTION_PREV_SONG, can_prev);
		}
		if (this.can_next !== can_next)
		{
			this.can_next = can_next;
			Nuvola.updateAction(Nuvola.ACTION_NEXT_SONG, can_next);
		}
		if (this.can_thumbs_up !== can_thumbs_up)
		{
			this.can_thumbs_up = can_thumbs_up;
			Nuvola.updateAction(Nuvola.ACTION_THUMBS_UP, can_thumbs_up);
		}
		if (this.can_thumbs_down !== can_thumbs_down)
		{
			this.can_thumbs_down = can_thumbs_down;
			Nuvola.updateAction(Nuvola.ACTION_THUMBS_DOWN, can_thumbs_down);
		}
		
		// Schedule update
		setTimeout(Nuvola.bind(this, this.update), 500);
	}
	
	/**
	 * Message handler
	 * @param cmd command to execute
	 */
	Integration.prototype.messageHandler = function(cmd)
	{
		/* Respond to user actions */
		try
		{
			switch (cmd)
			{
			case Nuvola.ACTION_PLAY:
				if (this.state != Nuvola.STATE_PLAYING)
					$('.playControl').click();
				break;
			case Nuvola.ACTION_PAUSE:
				$('.playControl').click();
				break;
			case Nuvola.ACTION_TOGGLE_PLAY:
				$('.playControl').click();
				break;
			case Nuvola.ACTION_PREV_SONG:
				$('.skipControl__previous').click();
				break;
			case Nuvola.ACTION_NEXT_SONG:
				$('.skipControl__next').click();
				break;
			case Nuvola.ACTION_THUMBS_UP:
				$('.playing .sc-button-like').click();
				break;
			case Nuvola.ACTION_THUMBS_DOWN:
				alert("Thumbs down!");
				break;
			default:
				// Other commands are not supported
				throw {"message": "Not supported."};
			}
			console.log(this.name + ": comand '" + cmd + "' executed.");
		}
		catch (e)
		{
			// Older API expected exception to be a string.
			throw (this.name + ": " + e.message);
		}
	}
	
	/* Store reference */ 
	Nuvola.integration = new Integration(); // Singleton

// Immediately call the anonymous function with Nuvola JS API main object as an argument.
// Note that "this" is set to the Nuvola JS API main object.
})(this);
